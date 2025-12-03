"use client";

import { useMemo } from "react";
import { EntityList } from "@/components/shared";
import { createRolesConfig } from "./config";

interface RolesListProps {
    initialPage?: number;
    initialSearch?: string;
    initialPageSize?: number;
}

/**
 * Roles List Component
 * Uses the generic EntityList with Roles-specific configuration
 * 
 * Reduced from 404 lines to 35 lines using the generic architecture!
 */
export default function RolesList({
    initialPage = 1,
    initialSearch = "",
    initialPageSize = 10,
}: RolesListProps) {
    // Create configuration
    const config = useMemo(() => createRolesConfig(), []);

    return (
        <EntityList
            config={config}
            title="Roles"
            description="Manage roles and permissions"
            initialPage={initialPage}
            initialSearch={initialSearch}
            initialPageSize={initialPageSize}
        />
    );
}
