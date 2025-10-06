"use server";

import { safeParse } from "valibot";
import { loginSchema } from "@/lib/valibot/schemas/loginSchema";
import { apiClient } from "@/lib/api-client";
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
    console.log("🔐 Attempting login...");

    // Make login request - cookie will be set by backend
    const res = await apiClient.post<
      typeof parsed.output,
      { message?: string }
    >("/api/v1/auth/login", parsed.output);

    console.log("✅ Login successful! Redirecting to admin panel...");

  } catch (err: any) {
    console.error("❌ Login error:", err);
    return {
      success: false,
      errors: {},
      message: err.message || "Server error",
    };
  }

  // ✅ Move redirect OUTSIDE the try/catch block
  redirect("/admin/panel");
}
