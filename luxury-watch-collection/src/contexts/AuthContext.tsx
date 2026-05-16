import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, USERS } from "../data/const";

interface AuthContextType {
  user: User | null;
  login: (userId: string, pin: string) => boolean;
  logout: () => void;
  isOwner: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("pwc_current_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  function login(userId: string, pin: string): boolean {
    const found = USERS.find((u) => u.id === userId && u.pin === pin);
    if (found) {
      setUser(found);
      localStorage.setItem("pwc_current_user", JSON.stringify(found));
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("pwc_current_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isOwner: user?.role === "owner" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}