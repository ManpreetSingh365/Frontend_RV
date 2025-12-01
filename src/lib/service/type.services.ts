import { apiClient } from "@/lib/api/api-client";

/* ================= TYPE DEFINITIONS ================= */

// Vehicle Types
export interface VehicleTypeResponse {
    vehicleTypes: string[];
}

// SIM Categories
export interface SimCategoryResponse {
    simCategories: string[];
}

// Device Models
export interface DeviceModelResponse {
    deviceModels: string[];
}

// Device Alert Types
export interface DeviceAlertTypeResponse {
    deviceAlertTypes: string[];
}

// Address Types
export interface AddressTypeResponse {
    name: string;
    description: string;
}

// Permissions Types
export interface PermissionsTypeResponse {
    category: string;
    permissions: string[];
}

/* ================= TYPE SERVICES ================= */

/**
 * Fetch all available vehicle types
 * @returns Array of vehicle type strings (CAR, TRUCK, VAN, etc.)
 */
export const getVehicleTypes = () =>
    apiClient.get<VehicleTypeResponse>("/types/vehicle-types");

/**
 * Fetch all available SIM categories
 * @returns Array of SIM category strings
 */
export const getSimCategories = () =>
    apiClient.get<SimCategoryResponse>("/types/sim-categories");

/**
 * Fetch all supported device models
 * @returns Array of device model strings
 */
export const getDeviceModels = () =>
    apiClient.get<DeviceModelResponse>("/types/device-models");

/**
 * Fetch all available device alert types
 * @returns Array of device alert type strings
 */
export const getDeviceAlertTypes = () =>
    apiClient.get<DeviceAlertTypeResponse>("/types/device-alert-types");

/**
 * Fetch all available address types
 * @returns Array of address type objects with type and label
 */
export const getAddressTypes = () =>
    apiClient.get<AddressTypeResponse[]>("/types/address-types");

/**
 * Fetch all available address types
 * @returns Array of address type objects with type and label
 */
export const getPermissionsType = () =>
    apiClient.get<PermissionsTypeResponse[]>("/permissions");
