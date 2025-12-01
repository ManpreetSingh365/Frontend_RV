import { apiClient } from "@/lib/api/api-client";
import type { CreateRoleInput, UpdateRoleInput } from "@/lib/validation/role.schema";

/* ================= TYPE DEFINITIONS ================= */

export type Role = {
    id: string;
    name: string;
    description: string;
    active: boolean;
    organizationId: string | null;
    roleLevel: number;
    assignedUserCount: number;
    roleScope: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    permissions: string[];
};

export interface RoleQueryParams {
    page?: number;
    size?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    viewMode?: string;
}

/* ================= ROLE SERVICES ================= */

// CREATE ROLE
export const createRole = (payload: CreateRoleInput) =>
    apiClient.post<CreateRoleInput, Role>("/role", payload);

// GET ALL ROLES (with optional pagination)
export const getRoles = (params?: RoleQueryParams) => {
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
            viewMode: params?.viewMode ?? "hierarchy",
        },
    };

    return apiClient.postPaginated<typeof requestBody, Role>("/role/search", requestBody);
};

// GET ROLE BY ID
export const getRoleById = (roleId: string) =>
    apiClient.get<Role>(`/role/${roleId}`);

// UPDATE ROLE
export const updateRole = (roleId: string, payload: UpdateRoleInput) =>
    apiClient.put<UpdateRoleInput, Role>(`/role/${roleId}`, payload);

// SOFT DELETE ROLE
export const deleteRole = (roleId: string) =>
    apiClient.delete<void>(`/role/${roleId}`);

// HARD DELETE ROLE
export const hardDeleteRole = (roleId: string) =>
    apiClient.delete<void>(`/role/hard/${roleId}`);
