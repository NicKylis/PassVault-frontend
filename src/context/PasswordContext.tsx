import { createContext, useState, useEffect, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { PasswordEntity } from "@/types/Passwords";

interface SharedUserEntry {
  _id: string; // shared password record ID
  sharedWithId: { _id: string; name: string; email: string };
  favorite?: boolean;
  lastUsedAt?: string;
}

interface ShareResult {
  email: string;
  status: "success" | "failed";
  reason?: string;
  sharedId?: string;
}

type PasswordContextType = {
  passwords: PasswordEntity[];
  refresh: () => Promise<void>;
  addPassword: (
    password: Omit<
      PasswordEntity,
      "id" | "createdAt" | "updatedAt" | "favorite" | "shared"
    >
  ) => Promise<void>;
  toggleFavorite: (password: PasswordEntity) => Promise<void>;
  deletePassword: (id: string) => Promise<void>;
  sharePassword: (
    id: string,
    email: string | string[]
  ) => Promise<ShareResult[]>;
  removeSharedPassword: (password: PasswordEntity) => Promise<void>;
  editPassword: (
    id: string,
    updates: Partial<Omit<PasswordEntity, "id" | "createdAt" | "updatedAt">>
  ) => Promise<void>;
  markUsed: (password: PasswordEntity) => Promise<void>;
  getSharedUsers: (passwordId: string) => Promise<SharedUserEntry[]>;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const PasswordContext = createContext<PasswordContextType>({
  passwords: [],
  refresh: async () => {},
  addPassword: async () => {},
  toggleFavorite: async () => {},
  deletePassword: async () => {},
  sharePassword: async () => [],
  removeSharedPassword: async () => {},
  editPassword: async () => {},
  markUsed: async () => {},
  getSharedUsers: async () => [],
});

export const PasswordProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, token } = useAuth();
  const [ownedPasswords, setOwnedPasswords] = useState<PasswordEntity[]>([]);
  const [sharedPasswords, setSharedPasswords] = useState<PasswordEntity[]>([]);

  // cache shared users per passwordId
  const [sharedUsersMap, setSharedUsersMap] = useState<
    Record<string, SharedUserEntry[]>
  >({});

  // Sync axios authorization header with token
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const fetchPasswords = async () => {
    try {
      const res = await api.get("/api/passwords");
      setOwnedPasswords(res.data.owned || []);
      setSharedPasswords(res.data.shared || []);
    } catch (err) {
      console.error("Failed to fetch passwords:", err);
      setOwnedPasswords([]);
      setSharedPasswords([]);
    }
  };

  const passwords = useMemo(() => {
    return [
      ...ownedPasswords.map((p) => ({ ...p, shared: false, id: p.id })),
      ...sharedPasswords.map((s) => ({
        ...s,
        shared: true,
        favorite: s.favorite,
        id: s.sharedRecordId!,
      })),
    ].sort(
      (a, b) =>
        new Date(b.lastUsedAt || 0).getTime() -
        new Date(a.lastUsedAt || 0).getTime()
    );
  }, [ownedPasswords, sharedPasswords]);

  const addPassword = async (
    password: Omit<
      PasswordEntity,
      "id" | "createdAt" | "updatedAt" | "favorite" | "shared"
    >
  ) => {
    try {
      await api.post<PasswordEntity>("/api/passwords", password);
      fetchPasswords();
    } catch (err) {
      console.error("Failed to add password:", err);
      throw err;
    }
  };

  const toggleFavorite = async (password: PasswordEntity) => {
    // Optimistic update
    if (password.shared) {
      setSharedPasswords((prev) =>
        prev.map((p) =>
          p.sharedRecordId === password.id ? { ...p, favorite: !p.favorite } : p
        )
      );
    } else {
      setOwnedPasswords((prev) =>
        prev.map((p) =>
          p.id === password.id ? { ...p, favorite: !p.favorite } : p
        )
      );
    }

    try {
      // Send API request (async, no need to wait for it to update UI)
      await api.patch(`/api/passwords/${password.id}/favorite`, {
        shared: password.shared,
      });
      toast.success(
        `Password "${password.title}" ${
          password.favorite ? "removed from favorites" : "added to favorites"
        }`
      );
    } catch (err) {
      console.error("Error toggling favorite", err);
      toast.error("Failed to toggle favorite");
      // optional rollback
      fetchPasswords();
    }
  };

  const deletePassword = async (id: string) => {
    try {
      await api.delete(`/api/passwords/${id}`);
      fetchPasswords();
      toast.success("Password deleted successfully");
    } catch (err) {
      console.error("Failed to delete password:", err);
      toast.error("Failed to delete password");
    }
  };

  const editPassword = async (
    id: string,
    updates: Partial<Omit<PasswordEntity, "id" | "createdAt" | "updatedAt">>
  ) => {
    try {
      await api.put(`/api/passwords/${id}`, updates);
      fetchPasswords();
    } catch (err) {
      console.error("Failed to edit password:", err);
      toast.error("Failed to edit password");
    }
  };

  const sharePassword = async (
    id: string,
    emails: string | string[]
  ): Promise<ShareResult[]> => {
    const emailArray = Array.isArray(emails) ? emails : [emails];

    try {
      const res = await api.post<{ results: ShareResult[] }>(
        `/api/passwords/${id}/share`,
        { emails: emailArray }
      );

      // Invalidate cache for this password
      setSharedUsersMap((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });

      return res.data.results;
    } catch (err) {
      console.error("Failed to share password:", err);
      toast.error("Failed to share password");
      return [];
    }
  };

  const removeSharedPassword = async (password: PasswordEntity) => {
    try {
      await api.delete(`/api/passwords/shared/${password.id}`);
      // remove shared users cache
      setSharedUsersMap((prev) => {
        const copy = { ...prev };
        delete copy[password.id];
        return copy;
      });
      fetchPasswords();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove shared password");
    }
  };

  const markUsed = async (password: PasswordEntity) => {
    const now = new Date();
    if (password.shared) {
      setSharedPasswords((prev) =>
        prev.map((p) =>
          p.sharedRecordId === password.id ? { ...p, lastUsedAt: now } : p
        )
      );
    } else {
      setOwnedPasswords((prev) =>
        prev.map((p) => (p.id === password.id ? { ...p, lastUsedAt: now } : p))
      );
    }

    try {
      await api.patch(`/api/passwords/${password.id}/use`, {
        shared: password.shared,
      });
    } catch (err) {
      console.error("Failed to mark password as used:", err);
      fetchPasswords();
    }
  };

  const getSharedUsers = async (passwordId: string) => {
    if (sharedUsersMap[passwordId]) return sharedUsersMap[passwordId];

    try {
      const res = await api.get(`/api/passwords/${passwordId}/shared-users`);
      setSharedUsersMap((prev) => ({ ...prev, [passwordId]: res.data }));
      return res.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPasswords();
    } else {
      // Clear all password data when logging out
      setOwnedPasswords([]);
      setSharedPasswords([]);
      setSharedUsersMap({});
    }
  }, [isAuthenticated]);

  return (
    <PasswordContext.Provider
      value={{
        passwords,
        refresh: fetchPasswords,
        addPassword,
        toggleFavorite,
        deletePassword,
        sharePassword,
        removeSharedPassword,
        editPassword,
        markUsed,
        getSharedUsers,
      }}
    >
      {children}
    </PasswordContext.Provider>
  );
};

export const usePasswords = () => useContext(PasswordContext);
