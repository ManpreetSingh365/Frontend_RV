import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const tokenCookie = req.cookies.get("auth_token");
  const token = tokenCookie?.value;
  const path = req.nextUrl.pathname;

  console.log(
    `🛡️ Middleware: ${path}, Auth token: ${token ? "Present" : "Missing"}`
  );

  // Protected routes that require authentication
  const isProtectedRoute =
    path.startsWith("/admin") ||
    path.startsWith("/dashboard") ||
    path.startsWith("/panel");

  // Auth routes that should redirect if already authenticated
  const isAuthRoute = path.startsWith("/login") || path.startsWith("/register");

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    console.log("🔒 Redirecting to login - no auth token");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect to admin panel if already authenticated and trying to access auth routes
  if (isAuthRoute && token) {
    console.log("✅ Redirecting to admin panel - already authenticated");
    return NextResponse.redirect(new URL("/admin/panel", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
