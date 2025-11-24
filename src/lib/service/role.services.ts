import { apiClient } from "@/lib/api/api-client";

/* ================= TYPE DEFINITIONS ================= */

export type Role = {
    id: string;
    name: string;
    description: string;
    active: boolean;
    organizationId: string | null;
    roleLevel: number;
    roleScope: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    permissions: string[];
};

export interface RoleQueryParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortOrder?: string;
    viewMode?: string;
}

/* ================= ROLE SERVICES ================= */

/**
 * Fetch all roles with optional pagination and sorting
 * @param params - Query parameters for pagination, sorting, and view mode
 * @returns Array of Role objects
 */
export const getRoles = (params?: RoleQueryParams) => {
    const queryParams: Record<string, string> = {};

    if (params?.page) queryParams.page = String(params.page);
    if (params?.size) queryParams.size = String(params.size);
    if (params?.sortBy) queryParams.sortBy = params.sortBy;
    if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;
    if (params?.viewMode) queryParams.viewMode = params.viewMode;

    const query = Object.keys(queryParams).length > 0
        ? `?${new URLSearchParams(queryParams).toString()}`
        : "";

    return apiClient.get<Role[]>(`/role${query}`);
};

/**
 * Fetch a specific role by ID
 * @param roleId - The ID of the role to fetch
 * @returns Role object
 */
export const getRoleById = (roleId: string) =>
    apiClient.get<Role>(`/role/${roleId}`);
