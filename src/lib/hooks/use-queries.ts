import { useQuery } from "@tanstack/react-query";
import { getRoles } from "@/lib/service/role.services";
import { getAddressTypes, getPermissionsType, getSimCategories, getDeviceModels, getDeviceProtocolTypes } from "@/lib/service/type.services";
import { getVehiclesPaginated } from "@/lib/service/vehicle.service";

// Query Keys
export const QUERY_KEYS = {
    roles: ["roles"],
    vehicles: ["vehicles"],
    addressTypes: ["addressTypes"],
    users: ["users"],
    permissions: ["permissions"],
    organizations: ["organizations"],
    subscriptionPlans: ["subscriptionPlans"],
    devices: ["devices"],
    simCategories: ["simCategories"],
    deviceModels: ["deviceModels"],
    deviceProtocolTypes: ["deviceProtocolTypes"],
} as const;

/**
 * Hook to fetch Roles (simple array response)
 * Uses TanStack Query for caching and deduplication
 * Used when you only need the roles array without pagination metadata
 */
export function useRolesQuery(params?: import("@/lib/service/role.services").RoleQueryParams) {
    return useQuery({
        queryKey: [...QUERY_KEYS.roles, params],
        queryFn: () => getRoles(params),
        select: (response) => response.data || [], // Extract data array from paginated response
        staleTime: 5 * 60 * 1000, // 5 minutes (roles don't change often)
    });
}

/**
 * Hook to fetch Roles with pagination metadata
 * Returns the full paginated response including data and meta
 */
export function useRolesPaginatedQuery(params?: import("@/lib/service/role.services").RoleQueryParams) {
    return useQuery({
        queryKey: [...QUERY_KEYS.roles, params],
        queryFn: () => getRoles(params),
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new data
        staleTime: 5 * 60 * 1000, // 5 minutes (roles don't change often)
    });
}

/**
 * Hook to fetch Vehicles
 */
export function useVehiclesQuery() {
    return useQuery({
        queryKey: QUERY_KEYS.vehicles,
        queryFn: () => getVehiclesPaginated({}),
        select: (response) => response.data || [],
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * Hook to fetch Address Types
 */
/**
 * Hook to fetch Address Types
 */
export function useAddressTypesQuery() {
    return useQuery({
        queryKey: QUERY_KEYS.addressTypes,
        queryFn: () => getAddressTypes(),
        select: (response) => response.data || [],
        staleTime: 60 * 60 * 1000, // 1 hour (static data)
    });
}


/**
 * Hook to fetch Permissions
 */
export function usePermissionsQuery() {
    return useQuery({
        queryKey: QUERY_KEYS.permissions,
        queryFn: async () => {
            const response = await getPermissionsType();
            return response.data || [];
        },
        staleTime: 60 * 60 * 1000, // 1 hour (static data)
    });
}

/**
 * Hook to fetch Users
 */
export function useUsersQuery(params: import("@/lib/service/user.service").UserQueryParams) {
    return useQuery({
        queryKey: [...QUERY_KEYS.users, params],
        queryFn: () => import("@/lib/service/user.service").then((mod) => mod.getUsers(params)),
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new data
    });
}

/**
 * Hook to fetch Organizations
 */
export function useOrganizationsQuery(params: import("@/lib/service/organization.service").OrganizationQueryParams) {
    return useQuery({
        queryKey: [...QUERY_KEYS.organizations, params],
        queryFn: () => import("@/lib/service/organization.service").then((mod) => mod.getOrganizations(params)),
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new data
    });
}

/**
 * Hook to fetch Subscription Plans
 */
export function useSubscriptionPlansQuery(params: import("@/lib/service/subscription-plan.service").SubscriptionPlanQueryParams) {
    return useQuery({
        queryKey: [...QUERY_KEYS.subscriptionPlans, params],
        queryFn: () => import("@/lib/service/subscription-plan.service").then((mod) => mod.getSubscriptionPlans(params)),
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new data
    });
}

/**
 * Hook to fetch Devices
 */
export function useDevicesQuery(params: import("@/lib/service/device.service").DeviceQueryParams) {
    return useQuery({
        queryKey: [...QUERY_KEYS.devices, params],
        queryFn: () => import("@/lib/service/device.service").then((mod) => mod.getDevices(params)),
        placeholderData: (previousData) => previousData,
    });
}

/**
 * Hook to fetch Vehicles (paginated for entity list)
 */
export function useVehiclesPaginatedQuery(params: import("@/lib/service/vehicle.service").VehicleQueryParams) {
    return useQuery({
        queryKey: [...QUERY_KEYS.vehicles, "paginated", params],
        queryFn: () => import("@/lib/service/vehicle.service").then((mod) => mod.getVehiclesPaginated(params)),
        placeholderData: (previousData) => previousData,
    });
}

/**
 * Hook to fetch Vehicle Types
 * Returns array formatted for SearchableCombobox
 */
export function useVehicleTypesQuery() {
    return useQuery({
        queryKey: ["vehicleTypes"],
        queryFn: async () => {
            const response = await import("@/lib/service/type.services").then((mod) => mod.getVehicleTypes());
            // Transform to ComboboxOption format
            return response.data?.map((type: any) => ({
                value: type.name,
                label: type.name,
                description: `${type.category} - ${type.description}`,
            })) || [];
        },
        staleTime: 60 * 60 * 1000, // 1 hour (static reference data)
    });
}

/**
 * Hook to fetch SIM Categories
 * Returns array of SIM category strings (AIRTEL, VODAFONE, JIO, etc.)
 */
export function useSimCategoriesQuery() {
    return useQuery({
        queryKey: QUERY_KEYS.simCategories,
        queryFn: () => getSimCategories(),
        select: (response) => response.data?.simCategories || [],
        staleTime: 60 * 60 * 1000, // 1 hour (static reference data)
    });
}

/**
 * Hook to fetch Device Models
 * Returns array of device model strings (V5, SK05, TK103, etc.)
 */
export function useDeviceModelsQuery() {
    return useQuery({
        queryKey: QUERY_KEYS.deviceModels,
        queryFn: () => getDeviceModels(),
        select: (response) => response.data?.deviceModels || [],
        staleTime: 60 * 60 * 1000, // 1 hour (static reference data)
    });
}

/**
 * Hook to fetch Device Protocol Types
 * Returns array of protocol type strings (GT06, etc.)
 */
export function useDeviceProtocolTypesQuery() {
    return useQuery({
        queryKey: QUERY_KEYS.deviceProtocolTypes,
        queryFn: () => getDeviceProtocolTypes(),
        select: (response) => response.data?.deviceProtocolTypes || [],
        staleTime: 60 * 60 * 1000, // 1 hour (static reference data)
    });
}

