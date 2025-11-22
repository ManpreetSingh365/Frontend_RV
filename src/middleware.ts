import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const tokenCookie = req.cookies.get("access_token");
    const token = tokenCookie?.value;
    const path = req.nextUrl.pathname;

    // ✅ Enhanced logging
    console.log(`🛡️ Middleware: ${path}`);
    console.log(
        `🔐 Auth Token: ${token ? `Present (${token.substring(0, 20)}...)` : "Missing"
        }`
    );

    // Protected routes that require authentication
    const isProtectedRoute =
        path.startsWith("/admin") ||
        path.startsWith("/dashboard") ||
        path.startsWith("/panel");

    // Auth routes that should redirect if already authenticated
    const isAuthRoute = path.startsWith("/login") || path.startsWith("/register");

    // Skip middleware for static assets and API routes
    if (
        path.startsWith("/_next/") ||
        path.startsWith("/api/") ||
        path.includes(".") ||
        path === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    // ✅ Redirect to login if accessing protected route without token
    if (isProtectedRoute && !token) {
        console.log("🔒 Redirecting to login - authentication required");
        const loginUrl = new URL("/login", req.url);
        // Optional: Add return URL for post-login redirect
        loginUrl.searchParams.set("returnUrl", path);
        return NextResponse.redirect(loginUrl);
    }

    // ✅ Redirect to admin panel if already authenticated and trying to access auth routes
    if (isAuthRoute && token) {
        console.log("✅ Redirecting to admin panel - user already authenticated");
        return NextResponse.redirect(new URL("/admin/panel", req.url));
    }

    console.log("✅ Middleware: Request allowed to proceed");
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api routes (handled separately)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files with extensions
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
    ],
};
