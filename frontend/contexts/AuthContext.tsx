"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContextType, User } from "@/types/auth";
import axios from "axios";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing token in cookies
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/profile`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setToken(data.token);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
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
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      if (token && user) {
        // Set the token in localStorage
        localStorage.setItem("token", token);

        // Set axios default header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Update the auth state
        setUser(user);
        setToken(token);
        setIsAuthenticated(true);

        return { success: true };
      }

      throw new Error("Login failed");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      // Clear auth state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);

      // Remove token from localStorage
      localStorage.removeItem("token");

      // Remove Authorization header
      delete axios.defaults.headers.common["Authorization"];
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      }
    );

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const data = await response.json();
    setUser(data.user);
    setToken(data.token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        token,
        isAuthenticated,
        login,
        logout,
        register,
      }}
    >
      {children}
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
