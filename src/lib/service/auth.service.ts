// src/lib/service/auth.service.ts
import { apiClient } from "@/lib/api-client";

export const loginUser = (payload: {
    username: string;
    password: string;
    rememberMe?: boolean;
}) =>
    apiClient.post<
        { username: string; password: string; rememberMe?: boolean }, undefined
    >("/auth/login", payload);

export const logoutUser = () =>
    apiClient.post<void, void>("/auth/logout", undefined);

export const refreshToken = () =>
    apiClient.post<void, { accessToken: string }>("/auth/refresh", undefined);
