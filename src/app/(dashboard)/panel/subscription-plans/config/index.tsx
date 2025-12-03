import { EntityConfig } from "@/lib/types/entity-config";
import { createSubscriptionPlanColumns, SubscriptionPlan } from "./columns";
import * as subscriptionPlanService from "@/lib/service/subscription-plan.service";
import { useSubscriptionPlansQuery } from "@/lib/hooks";
import AddSubscriptionPlanDialog from "../components/dialogs/AddSubscriptionPlanDialog";
import UpdateSubscriptionPlanDialog from "../components/dialogs/UpdateSubscriptionPlanDialog";

/**
 * Complete entity configuration for Subscription Plans
 * This drives the entire CRUD UI via the generic EntityList component
 */
export function createSubscriptionPlansConfig(): EntityConfig<SubscriptionPlan> {
    return {
        // Entity metadata
        entityName: "subscription plan",
        entityNamePlural: "subscription plans",

        // Service layer - wrap API responses to match EntityService interface
        service: {
            list: async (params: any) => {
                const response = await subscriptionPlanService.getSubscriptionPlans(params);
                return {
                    data: response.data || [],
                    meta: response.meta,
                };
            },
            getById: async (id: string) => {
                const response = await subscriptionPlanService.getSubscriptionPlanById(id);
                return { data: response.data! };
            },
            create: async (data: any) => {
                const response = await subscriptionPlanService.createSubscriptionPlan(data);
                return {
                    data: response.data!,
                    message: response.message || undefined,
                };
            },
            update: async (id: string, data: any) => {
                const response = await subscriptionPlanService.updateSubscriptionPlan(id, data);
                return {
                    data: response.data!,
                    message: response.message || undefined,
                };
            },
            delete: async (id: string) => {
                const response = await subscriptionPlanService.deleteSubscriptionPlan(id);
                return { message: response.message || undefined };
            },
            restore: async (id: string) => {
                const response = await subscriptionPlanService.restoreSubscriptionPlan(id);
                return { message: response.message || undefined };
            },
            hardDelete: async (id: string) => {
                const response = await subscriptionPlanService.hardDeleteSubscriptionPlan(id);
                return { message: response.message || undefined };
            },
        },

        // Data fetching
        useQuery: useSubscriptionPlansQuery,

        // Table columns - factory function that creates columns with action handlers
        columns: (handlers) => createSubscriptionPlanColumns(handlers),

        // Filters
        filters: [
            {
                id: "viewMode",
                type: "select",
                label: "View Mode",
                value: "hierarchy",
                onChange: () => { }, // Will be overridden by EntityList
                options: [
                    { label: "Hierarchy", value: "hierarchy" },
                    { label: "Created By", value: "createdBy" },
                    { label: "Both", value: "both" },
                ],
            },
        ],

        // Dialogs
        dialogs: {
            create: (props) => (
                <AddSubscriptionPlanDialog
                    open={props.open}
                    onOpenChange={props.onOpenChange}
                    onPlanCreated={props.onSuccess}
                />
            ),
            edit: (props) => (
                <UpdateSubscriptionPlanDialog
                    planId={props.entity.id}
                    open={props.open}
                    onOpenChange={props.onOpenChange}
                    onPlanUpdated={props.onSuccess}
                />
            ),
        },

        // Features
        features: {
            softDelete: true,
            hardDelete: true,
            bulkOperations: true,
            selection: true,

            // ✨ Advanced Features
            columnCustomization: true,
            defaultVisibleColumns: ["status", "name", "amount", "duration", "features", "createdAt", "updatedAt"],
            advancedFiltering: true,
            virtualScrolling: true,
            virtualScrollingThreshold: 50,
            estimatedRowHeight: 60,
            virtualContainerHeight: "600px",
        },

        // Custom messages
        messages: {
            emptyState: "Get started by creating your first subscription plan",
            deleteConfirm: (plan) => plan.name,
        },

        // Empty state icon
        emptyIcon: "credit-card",
    };
}

// Export column creator for backward compatibility
export { createSubscriptionPlanColumns };
