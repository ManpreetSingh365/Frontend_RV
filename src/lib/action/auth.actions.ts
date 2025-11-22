// src/lib/action/auth.actions.ts
"use server";

import {
    loginUser,
    logoutUser,
    refreshToken,
} from "../service/auth.service";

import { loginSchema } from "@/lib/validation/auth.schema";
import { safeParse } from "valibot";
import { LoginResult } from "../type/LoginResult";
import { redirect } from "next/navigation";

export async function loginAction(
    prevState: LoginResult | null,
    formData: FormData
): Promise<LoginResult | null> {

    const payload = {
        username: formData.get("username"),
        password: formData.get("password"),
        rememberMe: formData.get("rememberMe") === "on",
    };

    const validated = safeParse(loginSchema, payload);

    if (!validated.success) {
        const fieldErrors: Record<string, string[]> = {};

        validated.issues.forEach(issue => {
            const key = issue.path?.[0];
            if (key) {
                const keyStr = String(key);
                if (!fieldErrors[keyStr]) fieldErrors[keyStr] = [];
                fieldErrors[keyStr].push(issue.message);
            }
        });

        return {
            success: false,
            fieldErrors,
            message: "Validation failed",
        };
    }

    try {
        const response = await loginUser(validated.output);

        return {
            success: true,
            message: "Login successful",
        };

        // REDIRECT AFTER LOGIN
        // redirect("/admin/panel");
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Login failed",
        };
    }
}



export async function logoutAction() {
    await logoutUser();
}

export async function refreshTokenAction() {
    await refreshToken();
}
