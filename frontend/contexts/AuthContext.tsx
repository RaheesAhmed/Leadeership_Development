"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/auth";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const refreshAuth = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const response = await axios.get("/api/auth/profile");

      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth refresh failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      // Set the token cookie with proper encoding
      const encodedToken = encodeURIComponent(token);
      document.cookie = `token=${encodedToken}; path=/; max-age=86400; SameSite=Lax`;

      // Update state
      setUser(user);
      setIsAuthenticated(true);

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      // Clear any existing token
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    department?: string;
  }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register`,
        userData
      );

      const { user, token } = response.data;

      if (user && token) {
        document.cookie = `token=${token}; path=/; max-age=86400`;
        setUser(user);
        setIsAuthenticated(true);
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/logout`);
      // Clear the token cookie
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      setUser(null);
      setIsAuthenticated(false);
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
