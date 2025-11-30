import { useQuery } from "@tanstack/react-query";
import { getRoles } from "@/lib/service/role.services";
import { getVehicles } from "@/lib/service/vehicle.services";
import { getAddressTypes } from "@/lib/service/type.services";

// Query Keys
export const QUERY_KEYS = {
    roles: ["roles"],
    vehicles: ["vehicles"],
    addressTypes: ["addressTypes"],
    users: ["users"],
} as const;

/**
 * Hook to fetch Roles
 * Uses TanStack Query for caching and deduplication
 */
export function useRolesQuery(viewMode: "hierarchy" | "list" = "hierarchy") {
    return useQuery({
        queryKey: [...QUERY_KEYS.roles, viewMode],
        queryFn: () => getRoles({ viewMode }),
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
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * Hook to fetch Address Types
 */
export function useAddressTypesQuery() {
    return useQuery({
        queryKey: QUERY_KEYS.addressTypes,
        queryFn: () => getAddressTypes(),
        staleTime: 60 * 60 * 1000, // 1 hour (static data)
    });
}
