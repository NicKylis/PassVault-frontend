import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";

export interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Set default authorization header
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;
      } catch (err) {
        console.error("Failed to restore auth state:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post<{
        token: string;
        user: User;
      }>("http://localhost:5000/login", {
        email,
        password,
      });

      const { token: newToken, user: newUser } = res.data;

      // Update state
      setToken(newToken);
      setUser(newUser);

      // Persist to localStorage
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));

      // Set default authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } catch (err) {
      // Clear auth state on error
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];

      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContextValue = AuthContext;
