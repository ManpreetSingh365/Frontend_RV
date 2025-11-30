"use client";

import { createContext, useContext, useRef, useState, useEffect, type ReactNode } from "react";
import { getRoles, type Role } from "@/lib/service/role.services";
import { getVehicles, type VehicleResponse } from "@/lib/service/vehicle.services";
import { getAddressTypes, type AddressTypeResponse } from "@/lib/service/type.services";

// Context type definition
interface UserDataContextValue {
    roles: Role[];
    vehicles: VehicleResponse[];
    addressTypes: AddressTypeResponse[];
    loading: boolean;
    error: string | null;
}

const UserDataContext = createContext<UserDataContextValue | undefined>(undefined);

// Provider component
export function UserDataProvider({ children }: { children: ReactNode }) {
    const hasFetchedRef = useRef(false);
    const [state, setState] = useState<UserDataContextValue>({
        roles: [],
        vehicles: [],
        addressTypes: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        // Prevent double-fetch in React StrictMode (development mode)
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;

        let isMounted = true;

        const fetchAllData = async () => {
            try {
                // Fetch all resources in parallel for optimal performance
                const [roles, vehicles, addressTypes] = await Promise.all([
                    getRoles({ viewMode: "hierarchy" }),
                    getVehicles({}),
                    getAddressTypes(),
                ]);

                if (isMounted) {
                    setState({
                        roles,
                        vehicles,
                        addressTypes,
                        loading: false,
                        error: null,
                    });
                }
            } catch (err) {
                if (isMounted) {
                    setState(prev => ({
                        ...prev,
                        loading: false,
                        error: err instanceof Error ? err.message : "Failed to fetch data",
                    }));
                    console.error("UserDataProvider fetch error:", err);
                }
            }
        };

        fetchAllData();

        return () => {
            isMounted = false;
        };
    }, []);

    return <UserDataContext.Provider value={state}>{children}</UserDataContext.Provider>;
}

// Custom hook to consume the context
export function useUserData() {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error("useUserData must be used within UserDataProvider");
    }
    return context;
}
