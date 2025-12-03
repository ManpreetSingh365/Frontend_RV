"use client";

import { EntityList } from "@/components/shared";
import { createSubscriptionPlansConfig } from "./config";

/**
 * Subscription Plans List Component
 * Uses the generic EntityList with subscription plans configuration
 */
export default function SubscriptionPlansList() {
    const config = createSubscriptionPlansConfig();

    return (
        <EntityList
            config={config}
            title="Subscription Plans"
            description="Manage subscription plans for your platform"
        />
    );
}
