import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import type { PasswordEntity } from "@/types/Passwords";

type PasswordContextType = {
  passwords: PasswordEntity[];
  refresh: () => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  markUsed: (id: string) => Promise<void>;
  addPassword: (
    password: Omit<PasswordEntity, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
};

const PasswordContext = createContext<PasswordContextType>({
  passwords: [],
  refresh: async () => {},
  toggleFavorite: async () => {},
  markUsed: async () => {},
  addPassword: async () => {},
});

export const PasswordProvider = ({ children }: { children: ReactNode }) => {
  const [passwords, setPasswords] = useState<PasswordEntity[]>([]);
  // Set auth header
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const fetchPasswords = async () => {
    try {
      const res = await axios.get<PasswordEntity[]>(
        "http://localhost:5000/api/passwords"
      );
      setPasswords(res.data);
    } catch (err) {
      console.error("Failed to fetch passwords:", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPasswords();
  }, []);

  // Optimistic favorite toggle
  const toggleFavorite = async (id: string) => {
    setPasswords((prev) =>
      prev.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p))
    );

    try {
      await axios.put(`http://localhost:5000/api/passwords/${id}/favorite`);
    } catch (err) {
      console.error(err);
      // rollback on failure
      setPasswords((prev) =>
        prev.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p))
      );
    }
  };

  const addPassword = async (
    password: Omit<PasswordEntity, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const res = await axios.post<PasswordEntity>(
        "http://localhost:5000/api/passwords",
        password
      );

      // Add to state (prepend so newest is first)
      setPasswords((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Failed to add password:", err);
      throw err;
    }
  };

  // Optimistic mark as used
  const markUsed = async (id: string) => {
    const now = new Date();
    setPasswords((prev) =>
      prev.map((p) => (p.id === id ? { ...p, lastUsedAt: now } : p))
    );

    try {
      await axios.put(`http://localhost:5000/api/passwords/${id}/use`);
    } catch (err) {
      console.error(err);
      // rollback on failure
      setPasswords((prev) =>
        prev.map((p) => (p.id === id ? { ...p, lastUsedAt: undefined } : p))
      );
    }
  };

  return (
    <PasswordContext.Provider
      value={{
        passwords,
        refresh: fetchPasswords,
        toggleFavorite,
        addPassword,
        markUsed,
      }}
    >
      {children}
    </PasswordContext.Provider>
  );
};

export const usePasswords = () => useContext(PasswordContext);
