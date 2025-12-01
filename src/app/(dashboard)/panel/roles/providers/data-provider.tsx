"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePermissionsQuery } from "@/lib/hooks/use-queries";
import type { PermissionCategory } from "@/lib/util/permission-utils";

interface RoleDataContextValue {
    permissionCategories: PermissionCategory[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

const RoleDataContext = createContext<RoleDataContextValue | undefined>(undefined);

export function RoleDataProvider({ children }: { children: ReactNode }) {
    const permissionsQuery = usePermissionsQuery();

    const value: RoleDataContextValue = {
        permissionCategories: permissionsQuery.data || [],
        loading: permissionsQuery.isLoading,
        error: permissionsQuery.error?.message || null,
        refetch: permissionsQuery.refetch
    };

    return <RoleDataContext.Provider value={value}>{children}</RoleDataContext.Provider>;
}

export function useRoleData() {
    const context = useContext(RoleDataContext);
    if (!context) {
        throw new Error("useRoleData must be used within RoleDataProvider");
    }
    return context;
}
