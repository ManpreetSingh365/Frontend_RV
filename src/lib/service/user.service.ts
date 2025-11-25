import { apiClient } from "@/lib/api/api-client";
import type { CreateUserInput } from "@/lib/validation/user.schema";

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


/* ================= USER CRUD ================= */
// Current, only use getUsers, deleteUser, hardDeleteUser from user.service.ts not from user.actions.ts

// CREATE USER
export const createUser = (payload: CreateUserInput) =>
    apiClient.post<CreateUserInput, User>("/users", payload);

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

// HARD DELETE USER
export const hardDeleteUser = (userId: string) =>
    apiClient.delete<void>(`/users/hard/${userId}`);
