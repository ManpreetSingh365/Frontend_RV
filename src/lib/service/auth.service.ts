// src/lib/service/auth.service.ts
import { apiClient } from "@/lib/api/api-client";
import { ApiResponse } from "../api/types";

interface LoginFormValues {
    username: string;
    password: string;
    rememberMe?: boolean;
}

interface LoginResponse {
    message: string;
}

/**
 * Login user - calls backend API with credentials: include
 * This function is called from CLIENT-SIDE code to ensure cookies reach the browser
 */
export const loginUser = async (payload: LoginFormValues): Promise<LoginResponse> => {
    return apiClient.post<LoginFormValues, LoginResponse>("/auth/login", payload);
};

export const logoutUser = () =>
    apiClient.post<void, ApiResponse<void>>("/auth/logout", undefined);

export const refreshToken = () =>
    apiClient.post<void, ApiResponse<{ accessToken: string }>>("/auth/refresh", undefined);
