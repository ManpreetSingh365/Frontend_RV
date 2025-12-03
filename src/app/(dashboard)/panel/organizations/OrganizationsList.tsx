"use client";

import { EntityList } from "@/components/shared";
import { createOrganizationsConfig } from "./config";

/**
 * Organizations List Component
 * Uses the generic EntityList with organizations configuration
 */
export default function OrganizationsList() {
    const config = createOrganizationsConfig();

    return (
        <EntityList
            config={config}
            title="Organizations"
            description="Manage organizations in your system"
        />
    );
}
