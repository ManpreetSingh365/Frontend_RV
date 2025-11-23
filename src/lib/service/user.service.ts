import { apiClient } from "@/lib/api/api-client";

// Adjust based on your backend User DTO
export type User = {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    roleId: string;
    active: boolean;
};

/* ================= USER CRUD ================= */

// CREATE USER
export const createUser = (payload: Partial<User>) =>
    apiClient.post<Partial<User>, User>("/users", payload);

// GET ALL USERS (with optional pagination)
export const getUsers = (params?: {
    page?: number;
    size?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    viewMode?: string;
}) => {
    const queryParams: Record<string, string> = {};

    if (params?.page) queryParams.page = String(params.page);
    if (params?.size) queryParams.size = String(params.size);
    if (params?.search) queryParams.search = params.search;
    if (params?.sortBy) queryParams.sortBy = params.sortBy;
    if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;
    if (params?.viewMode) queryParams.viewMode = params.viewMode;

    const query = Object.keys(queryParams).length > 0
        ? `?${new URLSearchParams(queryParams).toString()}`
        : "";

    return apiClient.get<User[]>(`/users${query}`);
};

// GET USER BY ID
export const getUserById = (userId: string) =>
    apiClient.get<User>(`/users/${userId}`);

// UPDATE USER
export const updateUser = (
    userId: string,
    payload: Partial<User>
) =>
    apiClient.put<Partial<User>, User>(
        `/users/${userId}`,
        payload
    );

// SOFT DELETE USER
export const deleteUser = (userId: string) =>
    apiClient.delete<void>(`/users/${userId}`);
