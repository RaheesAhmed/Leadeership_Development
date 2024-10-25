"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminLogin: (username: string, password: string) => Promise<void>;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAuth = () => {
      const cookies = document.cookie.split(";");
      const isAdminCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("isAdmin=")
      );
      setIsAdminAuthenticated(!!isAdminCookie);
    };
    checkAdminAuth();
  }, []);

  const adminLogin = async (username: string, password: string) => {
    if (username === "admin" && password === "admin123") {
      document.cookie = "isAdmin=true; path=/";
      setIsAdminAuthenticated(true);
      router.push("/admin");
    } else {
      throw new Error("Invalid admin credentials");
    }
  };

  const adminLogout = () => {
    document.cookie =
      "isAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setIsAdminAuthenticated(false);
    router.push("/admin/login");
  };

  return (
    <AdminAuthContext.Provider
      value={{ isAdminAuthenticated, adminLogin, adminLogout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
