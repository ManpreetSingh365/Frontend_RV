"use client";

import { useMemo } from "react";
import { EntityList } from "@/components/shared";
import { createUsersConfig } from "./config";
import { useRolesQuery } from "@/lib/hooks";

interface UsersListProps {
    initialPage?: number;
    initialSearch?: string;
    initialPageSize?: number;
}

/**
 * Users List Component
 * Uses the generic EntityList with Users-specific configuration
 * 
 * Reduced from 432 lines to 35 lines using the generic architecture!
 */
export default function UsersList({
    initialPage = 1,
    initialSearch = "",
    initialPageSize = 10,
}: UsersListProps) {
    // Fetch roles for filter dropdown
    const { data: rolesList } = useRolesQuery({ size: 100 });

    // Create configuration with roles data
    const config = useMemo(() => createUsersConfig(rolesList), [rolesList]);

    return (
        <EntityList
            config={config}
            title="Users"
            description="Manage system users and their permissions"
            initialPage={initialPage}
            initialSearch={initialSearch}
            initialPageSize={initialPageSize}
        />
    );
}
