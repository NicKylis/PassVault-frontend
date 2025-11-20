import { createContext, useState, useEffect, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { PasswordEntity } from "@/types/Passwords";

interface SharedUserEntry {
  _id: string; // the shared password record ID
  sharedWithId: {
    _id: string;
    name: string;
    email: string;
  };
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
  const { isAuthenticated } = useAuth();
  const [ownedPasswords, setOwnedPasswords] = useState<PasswordEntity[]>([]);
  const [sharedPasswords, setSharedPasswords] = useState<PasswordEntity[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const fetchPasswords = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/passwords");
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
  // Add password (owner only) const
  const addPassword = async (
    password: Omit<
      PasswordEntity,
      "id" | "createdAt" | "updatedAt" | "favorite" | "shared"
    >
  ) => {
    try {
      await axios.post<PasswordEntity>(
        "http://localhost:5000/api/passwords",
        password
      );
      fetchPasswords();
    } catch (err) {
      console.error("Failed to add password:", err);
      throw err;
    }
  };

  // Unified toggle favorite
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
      await axios.patch(
        `http://localhost:5000/api/passwords/${password.id}/favorite`,
        { shared: password.shared }
      );

      // Re-sync
      fetchPasswords();
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
      await axios.delete(`http://localhost:5000/api/passwords/${id}`);
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
      await axios.put(`http://localhost:5000/api/passwords/${id}`, updates);
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
    try {
      const emailArray = Array.isArray(emails) ? emails : [emails];

      const res = await axios.post<{ results: ShareResult[] }>(
        `http://localhost:5000/api/passwords/${id}/share`,
        { emails: emailArray }
      );

      return res.data.results;
    } catch (err) {
      console.error("Failed to share password:", err);
      toast.error("Failed to share password");
      return [];
    }
  };

  const removeSharedPassword = async (password: PasswordEntity) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/passwords/shared/${password.id}`
      );
      fetchPasswords();
    } catch (err) {
      console.error("Failed to remove shared password:", err);
      toast.error("Failed to remove shared password");
    }
  };

  // Mark password as used: Optimistic approach
  const markUsed = async (password: PasswordEntity) => {
    const now = new Date();

    // Optimistic update (instant UI)
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
      // Backend update (no need to wait for UI)
      await axios.patch(
        `http://localhost:5000/api/passwords/${password.id}/use`,
        { shared: password.shared }
      );

      // Optional: Re-sync with server
      fetchPasswords();
    } catch (err) {
      console.error("Failed to mark password as used:", err);
      // optional rollback
      fetchPasswords();
    }
  };

  const getSharedUsers = async (passwordId: string) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/passwords/${passwordId}/shared-users`
      );
      return res.data; // array of shared entries
    } catch (err) {
      console.error("Error fetching shared users:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchPasswords();
    else {
      setOwnedPasswords([]);
      setSharedPasswords([]);
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
