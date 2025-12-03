import { apiClient } from "@/lib/api/api-client";

// Organization entity type
export type Organization = {
    id: string;
    name: string;
    domain: string;
    description: string;
    settings: string | null;
    active: boolean;
    createdAt: string;
    updatedAt: string;
};

export interface OrganizationQueryParams {
    page?: number;
    size?: number;
    search?: string;
    viewMode?: string;
    sortBy?: string;
    sortOrder?: string;
}

export interface CreateOrganizationInput {
    name: string;
    domain: string;
    description?: string;
    settings?: string;
}

export interface UpdateOrganizationInput {
    name?: string;
    domain?: string;
    description?: string;
    settings?: string;
    active?: boolean;
}

/* ================= ORGANIZATION CRUD ================= */

// CREATE ORGANIZATION
export const createOrganization = (payload: CreateOrganizationInput) =>
    apiClient.post<CreateOrganizationInput, Organization>("/organizations", payload);

// GET ALL ORGANIZATIONS (with pagination and search)
export const getOrganizations = (params?: OrganizationQueryParams) => {
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

    return apiClient.postPaginated<typeof requestBody, Organization>(
        "/organizations/search",
        requestBody
    );
};

// GET ORGANIZATION BY ID
export const getOrganizationById = (organizationId: string) =>
    apiClient.get<Organization>(`/organizations/${organizationId}`);

// UPDATE ORGANIZATION
export const updateOrganization = (organizationId: string, payload: UpdateOrganizationInput) =>
    apiClient.put<UpdateOrganizationInput, Organization>(
        `/organizations/${organizationId}`,
        payload
    );

// SOFT DELETE ORGANIZATION
export const deleteOrganization = (organizationId: string) =>
    apiClient.delete<void>(`/organizations/${organizationId}`);

// HARD DELETE ORGANIZATION
export const hardDeleteOrganization = (organizationId: string) =>
    apiClient.delete<void>(`/organizations/hard/${organizationId}`);

// RESTORE ORGANIZATION
export const restoreOrganization = (organizationId: string) =>
    apiClient.patch<any, Organization>(`/organizations/restore/${organizationId}`, {});
