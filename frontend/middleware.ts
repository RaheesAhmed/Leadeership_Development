import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get("token");
  const isAdmin = request.cookies.get("isAdmin");
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup");
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin");
  const isAdminLoginPage = request.nextUrl.pathname === "/admin/login";

  // Allow access to admin login page
  if (isAdminLoginPage) {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // If trying to access auth pages while logged in, redirect to dashboard
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If trying to access protected pages while logged out, redirect to login
  if (!isAuthenticated && !isAuthPage && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If trying to access admin pages without admin rights, redirect to admin login
  if (isAdminPage && !isAdminLoginPage && !isAdmin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/assessment/:path*",
    "/login",
    "/signup",
  ],
};
