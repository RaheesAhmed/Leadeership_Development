"use client";

import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import AdminGuard from "@/components/AdminGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AdminAuthProvider>
  );
}
