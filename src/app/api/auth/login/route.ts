//src/app/api/auth/login
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("🔄 Route Handler: Proxying login to Spring Boot");

    // Forward to Spring Boot backend
    const backendResponse = await fetch(
      `${env.BACKEND_PATH}/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({
        message: `Backend error: ${backendResponse.status}`,
      }));

      console.error(`❌ Backend error: ${backendResponse.status}`);
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const responseData = await backendResponse.json();
    const setCookieHeader = backendResponse.headers.get("set-cookie");

    console.log("✅ Backend login successful");
    console.log(`🍪 Cookie to forward: ${setCookieHeader ? "Yes" : "No"}`);

    // Create response and forward cookie
    const response = NextResponse.json(responseData);

    if (setCookieHeader) {
      response.headers.set("Set-Cookie", setCookieHeader);
      console.log("🔄 Cookie forwarded to browser");
    }

    return response;
  } catch (error) {
    console.error("❌ Route Handler error:", error);
    return NextResponse.json(
      { message: "Authentication service unavailable" },
      { status: 500 }
    );
  }
}
