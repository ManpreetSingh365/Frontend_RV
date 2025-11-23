// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/validation/env";

export const runtime = "edge"; // ✅ Edge function for faster responses

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Forward login to Spring Boot backend
  const backendRes = await fetch(`${env.BACKEND_PATH}/portal/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  const data = await backendRes.json().catch(() => ({
    message: `Backend error: ${backendRes.status}`,
  }));

  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  // Forward cookies from backend if present
  const response = NextResponse.json(data);
  const cookie = backendRes.headers.get("set-cookie");
  if (cookie) response.headers.set("Set-Cookie", cookie);

  return response;
}
