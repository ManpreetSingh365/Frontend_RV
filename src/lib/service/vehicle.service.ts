import { apiClient } from "@/lib/api/api-client";

// Vehicle entity type
export type Vehicle = {
    id: string;
    licensePlate: string;
    brand: string;
    model: string;
    year: number;
    vin: string;
    vehicleOwner: string;
    emergencyNumber: string;
    vehicleType: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    deviceId: string | null;
    userIds: string[];
};

export interface VehicleQueryParams {
    page?: number;
    size?: number;
    search?: string;
    viewMode?: string;
    sortBy?: string;
    sortOrder?: string;
}

export interface CreateVehicleInput {
    licensePlate: string;
    brand: string;
    model: string;
    year: number;
    vin: string;
    vehicleOwner: string;
    emergencyNumber: string;
    vehicleType: string;
    deviceId: string;
    userIds: string[];
}

export interface UpdateVehicleInput {
    licensePlate?: string;
    brand?: string;
    model?: string;
    year?: number;
    vin?: string;
    vehicleOwner?: string;
    emergencyNumber?: string;
    vehicleType?: string;
    deviceId?: string | null;
    userIds?: string[];
}

/* ================= VEHICLE CRUD ================= */

// CREATE VEHICLE
export const createVehicle = (payload: CreateVehicleInput) =>
    apiClient.post<CreateVehicleInput, Vehicle>("/vehicles", payload);

// GET ALL VEHICLES (with pagination and search)
export const getVehiclesPaginated = (params?: VehicleQueryParams) => {
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

    return apiClient.postPaginated<typeof requestBody, Vehicle>(
        "/vehicles/search",
        requestBody
    );
};

// GET VEHICLE BY ID
export const getVehicleById = (vehicleId: string) =>
    apiClient.get<Vehicle>(`/vehicles/${vehicleId}`);

// UPDATE VEHICLE
export const updateVehicle = (vehicleId: string, payload: UpdateVehicleInput) =>
    apiClient.put<UpdateVehicleInput, Vehicle>(
        `/vehicles/${vehicleId}`,
        payload
    );

// SOFT DELETE VEHICLE
export const deleteVehicle = (vehicleId: string) =>
    apiClient.delete<void>(`/vehicles/${vehicleId}`);

// HARD DELETE VEHICLE
export const hardDeleteVehicle = (vehicleId: string) =>
    apiClient.delete<void>(`/vehicles/hard/${vehicleId}`);

// RESTORE VEHICLE
export const restoreVehicle = (vehicleId: string) =>
    apiClient.patch<any, Vehicle>(`/vehicles/restore/${vehicleId}`, {});
