"use server";

import { safeParse } from "valibot";
import { loginSchema } from "@/lib/valibot/schemas/loginSchema";
import { apiClient } from "@/lib/api-client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface ServerActionState {
  success: boolean;
  errors: Record<string, string>;
  message?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export async function loginAction(
  data: LoginPayload
): Promise<ServerActionState> {
  const parsed = safeParse(loginSchema, data);
  if (!parsed.success) {
    const errors =
      parsed.issues?.reduce<Record<string, string>>((acc, issue) => {
        const key = issue.path?.[0] as unknown as keyof LoginPayload;
        if (key) acc[key] = issue.message;
        return acc;
      }, {}) || {};
    return { success: false, errors };
  }

  try {
    console.log("🔐 Attempting login..."); // Debug log

    // Make login request - cookie will be set by backend
    const res = await apiClient.post<
      typeof parsed.output,
      { message?: string }
    >("/api/v1/auth/login", parsed.output);

    console.log("✅ Login successful, checking for cookie..."); // Debug log

    // Verify cookie was set (Next.js server-side)
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("auth_token");

    if (!authCookie) {
      console.warn("⚠️ Login succeeded but no auth cookie found!");
      return {
        success: false,
        errors: {},
        message: "Authentication cookie not set properly. Please try again.",
      };
    }

    console.log("🍪 Auth cookie verified:", authCookie.name); // Debug log

    // Redirect using Next.js redirect function for better handling
    redirect("/admin/panel");
  } catch (err: any) {
    console.error("❌ Login error:", err);
    return {
      success: false,
      errors: {},
      message: err.message || "Server error",
    };
  }
}
