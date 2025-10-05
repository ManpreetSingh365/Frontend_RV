"use server";

import { safeParse } from "valibot";
import { loginSchema } from "@/lib/valibot/schemas/loginSchema";
import { apiClient } from "@/lib/api-client";

export interface ServerActionState {
  success: boolean;
  errors: Record<string, string>;
  message?: string;
  token?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export async function loginAction(
  data: LoginPayload
): Promise<ServerActionState> {
  // 1️⃣ Validate input
  const parsed = safeParse(loginSchema, data);

  if (!parsed.success) {
    const errors =
      parsed.issues?.reduce<Record<string, string>>((acc, issue) => {
        // ✅ Safe TypeScript cast for issue.path[0]
        const key = issue.path?.[0] as unknown as keyof LoginPayload;
        if (key) acc[key] = issue.message;
        return acc;
      }, {}) || {};

    return { success: false, errors };
  }

  try {
    // 2️⃣ Call backend API
    const res = await apiClient.post<typeof parsed.output, { token: string }>(
      "/api/v1/auth/login",
      parsed.output
    );

    if (!res?.token) {
      return {
        success: false,
        errors: {},
        message: "Authentication failed",
      };
    }

    // 3️⃣ Return success and JWT
    return {
      success: true,
      errors: {},
      message: "Login successful",
      token: res.token,
    };
  } catch (err: any) {
    console.error("Login error:", err);
    return {
      success: false,
      errors: {},
      message: err.message || "Server error",
    };
  }
}
