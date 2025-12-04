// frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: number;
  email: string;
  state: string;
  language: string;
  // add username later if backend sends it
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  loading: boolean; // while checking localStorage on first load
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔁 On first load, read from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("lg_token");
      const storedUser = localStorage.getItem("lg_user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to read auth from localStorage", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData: User, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("lg_token", jwtToken);
    localStorage.setItem("lg_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("lg_token");
    localStorage.removeItem("lg_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Small helper hook for easier use
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
