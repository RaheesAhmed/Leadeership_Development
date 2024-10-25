"use client";

import { useAuth } from "@/contexts/AuthContext";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  // List of paths where we don't want to show the navbar
  const noNavbarPaths = ["/login", "/signup", "/"];

  const shouldShowNavbar = isAuthenticated && !noNavbarPaths.includes(pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      {children}
    </>
  );
}
