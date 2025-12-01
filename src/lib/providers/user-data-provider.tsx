"use client";

import { createContext, useContext, type ReactNode } from "react";
import { type Role } from "@/lib/service/role.services";
import { type VehicleResponse } from "@/lib/service/vehicle.services";
import { type AddressTypeResponse } from "@/lib/service/type.services";
import { useRolesQuery, useVehiclesQuery, useAddressTypesQuery } from "@/lib/hooks/use-queries";
import { useEntityData } from "@/lib/hooks/use-entity-data";

interface UserDataContextValue {
    roles: Role[];
    vehicles: VehicleResponse[];
    addressTypes: AddressTypeResponse[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

const UserDataContext = createContext<UserDataContextValue | undefined>(undefined);

export function UserDataProvider({ children }: { children: ReactNode }) {
    const rolesQuery = useRolesQuery({ viewMode: "hierarchy" });
    const vehiclesQuery = useVehiclesQuery();
    const addressTypesQuery = useAddressTypesQuery();

    const value = useEntityData({
        roles: { query: rolesQuery },
        vehicles: { query: vehiclesQuery },
        addressTypes: { query: addressTypesQuery },
    });

    return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}

export function useUserData() {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error("useUserData must be used within UserDataProvider");
    }
    return context;
}
