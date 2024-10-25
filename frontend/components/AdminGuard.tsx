"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const { isAdminAuthenticated } = useAdminAuth();
  const router = useRouter();
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  useEffect(() => {
    if (!isAdminAuthenticated && currentPath !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isAdminAuthenticated, router, currentPath]);

  if (!isAdminAuthenticated && currentPath !== "/admin/login") {
    router.push("/admin/login");
  }

  return <>{children}</>;
};

export default AdminGuard;
