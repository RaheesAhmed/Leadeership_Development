"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { User } from "@/types/auth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { subscriptionStatus } = useSubscription();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarImage = (user: User) => {
    return user.profileImage || undefined;
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl font-extrabold">
              <span className="bg-gradient-to-r from-indigo-800 to-indigo-600 bg-clip-text text-transparent">
                Leadership
              </span>{" "}
              <span className="text-indigo-600">Dev AI</span>
            </span>
          </Link>

          {/* Navigation Links - Centered with updated styling */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-2xl mx-auto">
            {user && (
              <div className="flex items-center justify-center gap-8">
                <Link
                  href="/assessment"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Assessment
                </Link>
                <Link
                  href="/development-plan"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Development Plan
                </Link>
                {subscriptionStatus?.plan_type === "premium" && (
                  <Link
                    href="/multi-rater"
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    Multi-Rater
                  </Link>
                )}
                <Link
                  href="/subscription"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Subscription
                </Link>
              </div>
            )}
          </div>

          {/* Auth Section - Right aligned */}
          <div className="flex items-center">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors rounded-md"
                >
                  Login
                </Link>
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white hover:from-indigo-700 hover:to-indigo-900 border-0 font-medium">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full ring-2 ring-primary/10 hover:ring-primary/20 transition-all"
                    >
                      <Avatar>
                        <AvatarImage
                          src={getAvatarImage(user)}
                          alt={user.name}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link href="/profile" className="flex w-full">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link href="/dashboard" className="flex w-full">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem className="cursor-pointer">
                        <Link href="/admin" className="flex w-full">
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:text-red-600"
                      onClick={handleLogout}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
