"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/auth";
import axios from "@/lib/axios"; // Use the configured axios instance
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
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/profile`
      );
      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        // Set admin cookie if user is admin
        if (response.data.user.role === "admin") {
          document.cookie = "isAdmin=true; path=/";
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        document.cookie =
          "isAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      }
    } catch (error) {
      console.error("Auth refresh failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      document.cookie =
        "isAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
  };

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refreshAuth();
      } catch (error) {
        console.error("Initial auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`,
        { email, password }
      );
      const { user } = response.data;

      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
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
      const { user } = response.data;

      if (user) {
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
    <AuthContext.Provider value={contextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
