// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { AuthUser, UpdateProfilePayload } from "../api/auth";
import { updateUserRequest } from "../api/auth";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  updateUser: (data: UpdateProfilePayload) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, read from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("lg_token");
    const storedUser = localStorage.getItem("lg_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: AuthUser, jwt: string) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem("lg_token", jwt);
    localStorage.setItem("lg_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("lg_token");
    localStorage.removeItem("lg_user");
  };

  const updateUser = async (data: UpdateProfilePayload) => {
    if (!user) return;

    // 1. Optimistic Update
    const optimisticUser = { ...user, ...data };
    setUser(optimisticUser as AuthUser);
    localStorage.setItem("lg_user", JSON.stringify(optimisticUser));

    try {
      // 2. API Call in Background
      const { user: updatedUser } = await updateUserRequest(data);

      // 3. Confirm with actual data from server
      const confirmedUser = { ...optimisticUser, ...updatedUser };
      setUser(confirmedUser);
      localStorage.setItem("lg_user", JSON.stringify(confirmedUser));
    } catch (err) {
      console.error("Failed to update user context", err);
      // 4. Revert on failure (optional, or just show toast)
      // For now, we will notify the user if it fails but keep the optimistic state until refresh,
      // or we could revert: setUser(user); localStorage.setItem(...)
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, updateUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
