import { useQuery } from "@tanstack/react-query";
import { getRoles } from "@/lib/service/role.services";
import { getVehicles } from "@/lib/service/vehicle.services";
import { getAddressTypes, getPermissionsType } from "@/lib/service/type.services";

// Query Keys
export const QUERY_KEYS = {
    roles: ["roles"],
    vehicles: ["vehicles"],
    addressTypes: ["addressTypes"],
    users: ["users"],
    permissions: ["permissions"],
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
        queryFn: () => getVehicles({}),
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

