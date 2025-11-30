"use client";

import { createContext, useContext, type ReactNode } from "react";
import { type Role } from "@/lib/service/role.services";
import { type VehicleResponse } from "@/lib/service/vehicle.services";
import { type AddressTypeResponse } from "@/lib/service/type.services";
import { useRolesQuery, useVehiclesQuery, useAddressTypesQuery } from "@/lib/hooks/use-queries";

// Context type definition
interface UserDataContextValue {
    roles: Role[];
    vehicles: VehicleResponse[];
    addressTypes: AddressTypeResponse[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

const UserDataContext = createContext<UserDataContextValue | undefined>(undefined);

// Provider component
export function UserDataProvider({ children }: { children: ReactNode }) {
    // Use TanStack Query hooks
    // These handle caching, deduplication, and background updates automatically
    const rolesQuery = useRolesQuery("hierarchy");
    const vehiclesQuery = useVehiclesQuery();
    const addressTypesQuery = useAddressTypesQuery();

    // Aggregate loading and error states
    const loading = rolesQuery.isLoading || vehiclesQuery.isLoading || addressTypesQuery.isLoading;

    const error =
        rolesQuery.error?.message ||
        vehiclesQuery.error?.message ||
        addressTypesQuery.error?.message ||
        null;

    // Combined refetch function
    const refetch = () => {
        rolesQuery.refetch();
        vehiclesQuery.refetch();
        addressTypesQuery.refetch();
    };

    const value: UserDataContextValue = {
        roles: rolesQuery.data || [],
        vehicles: vehiclesQuery.data || [],
        addressTypes: addressTypesQuery.data || [],
        loading,
        error,
        refetch
    };

    return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}

// Custom hook to consume the context
export function useUserData() {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error("useUserData must be used within UserDataProvider");
    }
    return context;
}
