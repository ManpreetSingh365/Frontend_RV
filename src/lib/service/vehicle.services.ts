// // src/lib/service/vehicle.services.ts
// import { apiClient } from "@/lib/api/api-client";

// /* ================= TYPE DEFINITIONS ================= */

// export type VehicleResponse = {
//     id: string;
//     licensePlate: string;
//     brand: string;
//     model: string;
//     year: number;
//     vin: string;
//     vehicleType: string;     // Enum as string
//     status: string;          // Enum as string
//     createdAt: string;       // "yyyy-MM-dd HH:mm:ss"
//     updatedAt: string;       // "yyyy-MM-dd HH:mm:ss"
//     deviceId?: string | null;
//     userIds?: string[];
// };

// /* ================= QUERY PARAMS ================= */

// export interface VehicleQueryParams {
//     page?: number;
//     size?: number;
//     sortBy?: string;
//     sortOrder?: string;
//     status?: string;
//     vehicleType?: string;
//     search?: string;
// }


// /* ================= VEHICLE SERVICES ================= */

// /**
//  * Fetch all vehicles with optional pagination, sorting and filters
// //  */
// // export const getVehicles = (params?: VehicleQueryParams) => {
// //     const queryParams: Record<string, string> = {};

// //     if (params?.page) queryParams.page = String(params.page);
// //     if (params?.size) queryParams.size = String(params.size);
// //     if (params?.sortBy) queryParams.sortBy = params.sortBy;
// //     if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;
// //     if (params?.status) queryParams.status = params.status;
// //     if (params?.vehicleType) queryParams.vehicleType = params.vehicleType;
// //     if (params?.search) queryParams.search = params.search;

// //     const query = Object.keys(queryParams).length > 0
// //         ? `?${new URLSearchParams(queryParams).toString()}`
// //         : "";

// //     return apiClient.get<VehicleResponse[]>(`/vehicles${query}`);
// // };

// /**
//  * Fetch a vehicle by ID
//  */
// export const getVehicleById = (vehicleId: string) => {
//     return apiClient.get<VehicleResponse>(`/vehicles/${vehicleId}`);
// };

// /**
//  * Fetch vehicles assigned to a specific user
//  */
// export const getVehiclesByUserId = (userId: string) => {
//     return apiClient.get<VehicleResponse[]>(`/vehicles/user/${userId}`);
// };
