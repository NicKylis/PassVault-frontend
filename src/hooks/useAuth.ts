import { useContext } from "react";
import { AuthContextValue } from "@/context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContextValue);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
