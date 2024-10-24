"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: { requireAdmin?: boolean } = {}
) {
  return function ProtectedRoute(props: P) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !user) {
        router.push("/login");
      }

      if (options.requireAdmin && user?.role !== "admin") {
        router.push("/dashboard");
      }
    }, [user, isLoading, router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!user || (options.requireAdmin && user.role !== "admin")) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
