// src/lib/action/auth.actions.ts
'use client';

import { loginUser, logoutUser, refreshToken } from "../service/auth.service";
import { loginSchema } from "@/lib/validation/auth.schema";
import { safeParse } from "valibot";
import { redirect } from "next/navigation";

type AlertVariant = "error" | "success" | "warning" | "info";

export interface LoginFormState {
    success?: boolean;
    message?: string;
    variant?: AlertVariant;
    fieldErrors?: Record<string, string[]>;
}

/**
 * Client-side login action - handles business logic
 * This runs in the BROWSER, not on the server
 * Compatible with React's useActionState hook
 * 
 * @param prevState - Previous form state (from useActionState)
 * @param formData - FormData from the form submission
 * @returns Promise<LoginFormState> - New state with success/error
 */
export async function loginAction(
    prevState: LoginFormState | null,
    formData: FormData
): Promise<LoginFormState> {
    // Step 1: Extract and prepare data
    const payload = {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
        rememberMe: formData.get("rememberMe") === "on",
    };

    // Step 2: Validate input with valibot schema
    const validatedPayload = safeParse(loginSchema, payload);

    if (!validatedPayload.success) {
        const fieldErrors: Record<string, string[]> = {};

        validatedPayload.issues.forEach(issue => {
            const key = issue.path?.[0];
            if (key) {
                const keyStr = String(key);
                if (!fieldErrors[keyStr]) fieldErrors[keyStr] = [];
                fieldErrors[keyStr].push(issue.message);
            }
        });

        return {
            success: false,
            variant: "error",
            fieldErrors,
            message: "Please fix the errors below",
        };
    }

    // Step 3: Call API (runs in browser, cookies will be stored)
    try {
        const response = await loginUser(validatedPayload.output);

        return {
            success: true,
            variant: "success",
            message: response.message || "Login Successful !",
        };
    } catch (error: any) {
        return {
            success: false,
            variant: "error",
            message: error.messages?.[0] || error.message || "Login failed. Please try again.",
        };
    }
}

export async function logoutAction() {
    await logoutUser();

    // after logout redirect to login page
    redirect("/login");
}

export async function refreshTokenAction() {
    await refreshToken();
}
