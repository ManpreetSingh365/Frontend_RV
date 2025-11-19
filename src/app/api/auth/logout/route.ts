// app/api/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Create a redirect response to /login
  const response = NextResponse.redirect(new URL("/login", request.url));

  // ✅ Clear the cookie properly and safely
  response.cookies.set({
    name: "access_token",
    value: "",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0), // force expire immediately
  });

  return response;
}
