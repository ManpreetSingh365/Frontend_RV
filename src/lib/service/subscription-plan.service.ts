import { apiClient } from "@/lib/api/api-client";

// Subscription Plan entity type
export type SubscriptionPlan = {
    id: string;
    name: string;
    amount: number;
    durationDays: number;
    features: string[];
    active: boolean;
    createdAt: string;
    updatedAt: string;
};

export interface SubscriptionPlanQueryParams {
    page?: number;
    size?: number;
    search?: string;
    viewMode?: string;
    sortBy?: string;
    sortOrder?: string;
}

export interface CreateSubscriptionPlanInput {
    name: string;
    amount: number;
    durationDays: number;
    features: string[];
    active?: boolean;
}

export interface UpdateSubscriptionPlanInput {
    name?: string;
    amount?: number;
    durationDays?: number;
    features?: string[];
    active?: boolean;
}

/* ================= SUBSCRIPTION PLAN CRUD ================= */

// CREATE SUBSCRIPTION PLAN
export const createSubscriptionPlan = (payload: CreateSubscriptionPlanInput) =>
    apiClient.post<CreateSubscriptionPlanInput, SubscriptionPlan>("/subscription-plans", payload);

// GET ALL SUBSCRIPTION PLANS (with pagination and search)
export const getSubscriptionPlans = (params?: SubscriptionPlanQueryParams) => {
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

    return apiClient.postPaginated<typeof requestBody, SubscriptionPlan>(
        "/subscription-plans/search",
        requestBody
    );
};

// GET SUBSCRIPTION PLAN BY ID
export const getSubscriptionPlanById = (planId: string) =>
    apiClient.get<SubscriptionPlan>(`/subscription-plans/${planId}`);

// UPDATE SUBSCRIPTION PLAN
export const updateSubscriptionPlan = (planId: string, payload: UpdateSubscriptionPlanInput) =>
    apiClient.put<UpdateSubscriptionPlanInput, SubscriptionPlan>(
        `/subscription-plans/${planId}`,
        payload
    );

// SOFT DELETE SUBSCRIPTION PLAN
export const deleteSubscriptionPlan = (planId: string) =>
    apiClient.delete<void>(`/subscription-plans/${planId}`);

// HARD DELETE SUBSCRIPTION PLAN
export const hardDeleteSubscriptionPlan = (planId: string) =>
    apiClient.delete<void>(`/subscription-plans/hard/${planId}`);

// RESTORE SUBSCRIPTION PLAN
export const restoreSubscriptionPlan = (planId: string) =>
    apiClient.patch<any, SubscriptionPlan>(`/subscription-plans/restore/${planId}`, {});
