"use client";

import { useAuth } from "@/contexts/AuthContext";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  // List of paths where we don't want to show the navbar
  const noNavbarPaths = ["/login", "/signup", "/admin"];

  // Show navbar if authenticated and not on excluded paths
  const shouldShowNavbar = !noNavbarPaths.includes(pathname);

  return (
    <>
      {!isLoading && shouldShowNavbar && <Navbar />}
      {children}
    </>
  );
}
