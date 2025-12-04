import { apiClient } from "@/lib/api/api-client";

// Device entity type
export type Device = {
    id: string;
    imei: string;
    deviceModel: string;
    firmwareVersion: string;
    simNumber: string;
    status: string;
    protocolType: string;
    simCategory: string;
    lastHeartbeat: string | null;
    expiryAt: string;
    createdAt: string;
    createdBy: string;
    vehicleId: string | null;
};

export interface DeviceQueryParams {
    page?: number;
    size?: number;
    search?: string;
    viewMode?: string;
    sortBy?: string;
    sortOrder?: string;
}

export interface CreateDeviceInput {
    imei: string;
    deviceModel: string;
    protocolType: string;
    simNumber: string;
    simCategory: string;
    firmwareVersion: string;
    subscriptionPlanId: string;
    paymentMethod: string;
}

export interface UpdateDeviceInput {
    imei?: string;
    deviceModel?: string;
    firmwareVersion?: string;
    simNumber?: string;
    protocolType?: string;
    simCategory?: string;
    vehicleId?: string | null;
}

/* ================= DEVICE CRUD ================= */

// CREATE DEVICE
export const createDevice = (payload: CreateDeviceInput) =>
    apiClient.post<CreateDeviceInput, Device>("/devices", payload);

// GET ALL DEVICES (with pagination and search)
export const getDevices = (params?: DeviceQueryParams) => {
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

    return apiClient.postPaginated<typeof requestBody, Device>(
        "/devices/search",
        requestBody
    );
};

// GET DEVICE BY ID
export const getDeviceById = (deviceId: string) =>
    apiClient.get<Device>(`/devices/${deviceId}`);

// UPDATE DEVICE
export const updateDevice = (deviceId: string, payload: UpdateDeviceInput) =>
    apiClient.put<UpdateDeviceInput, Device>(
        `/devices/${deviceId}`,
        payload
    );

// SOFT DELETE DEVICE
export const deleteDevice = (deviceId: string) =>
    apiClient.delete<void>(`/devices/${deviceId}`);

// HARD DELETE DEVICE
export const hardDeleteDevice = (deviceId: string) =>
    apiClient.delete<void>(`/devices/hard/${deviceId}`);

// RESTORE DEVICE
export const restoreDevice = (deviceId: string) =>
    apiClient.patch<any, Device>(`/devices/restore/${deviceId}`, {});
