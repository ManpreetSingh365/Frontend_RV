import { apiClient } from "@/lib/api/api-client";
import type { CreateUserInput, UpdateUserInput } from "@/lib/validation/user.schema";

// Adjust based on your backend User DTO
export type User = {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    active: boolean;
    lastLogin: string | null;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    modifiedBy: string;
    vehiclesIds: string[];
    vehicles?: any[];
    addresses: Array<{
        streetLine1: string;
        streetLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        landmark?: string;
        addressType: string;
        primaryAddress?: boolean;
    }>;
};

export interface UserQueryParams {
    page?: number;
    size?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: string;
    viewMode?: string;
}

/* ================= USER CRUD ================= */
// Current, only use getUsers, deleteUser, hardDeleteUser from user.service.ts not from user.actions.ts

// CREATE USER
export const createUser = (payload: CreateUserInput) =>
    apiClient.post<CreateUserInput, User>("/users", payload);

// GET ALL USERS (with optional pagination)
export const getUsers = (params?: UserQueryParams) => {
    const requestBody = {
        pagination: {
            page: params?.page ?? 1,
            size: params?.size ?? 10,
        },
        sort: {
            by: params?.sortBy ?? "createdAt",
            order: params?.sortOrder ?? "DESC",
        },
        filters: {
            search: params?.search ?? "",
            role: params?.role ?? "",
            viewMode: params?.viewMode ?? "hierarchy",
        },
    };

    return apiClient.postPaginated<typeof requestBody, User>("/users/search", requestBody);
};

// GET USER BY ID
export const getUserById = (userId: string) =>
    apiClient.get<User>(`/users/${userId}`);

// UPDATE USER
export const updateUser = (
    userId: string,
    payload: UpdateUserInput
) =>
    apiClient.put<UpdateUserInput, User>(
        `/users/${userId}`,
        payload
    );

// SOFT DELETE USER
export const deleteUser = (userId: string) =>
    apiClient.delete<void>(`/users/${userId}`);

// HARD DELETE USER
export const hardDeleteUser = (userId: string) =>
    apiClient.delete<void>(`/users/hard/${userId}`);

// RESTORE USER
export const restoreUser = (userId: string) =>
    apiClient.patch<any, User>(`/users/restore/${userId}`, {});
