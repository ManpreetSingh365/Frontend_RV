import { EntityConfig } from "@/lib/types/entity-config";
import { createOrganizationColumns, Organization } from "./columns";
import * as organizationService from "@/lib/service/organization.service";
import { useOrganizationsQuery } from "@/lib/hooks";
import AddOrganizationDialog from "../components/dialogs/AddOrganizationDialog";
import UpdateOrganizationDialog from "../components/dialogs/UpdateOrganizationDialog";

/**
 * Complete entity configuration for Organizations
 * This drives the entire CRUD UI via the generic EntityList component
 */
export function createOrganizationsConfig(): EntityConfig<Organization> {
    return {
        // Entity metadata
        entityName: "organization",
        entityNamePlural: "organizations",

        // Service layer - wrap API responses to match EntityService interface
        service: {
            list: async (params: any) => {
                const response = await organizationService.getOrganizations(params);
                return {
                    data: response.data || [],
                    meta: response.meta,
                };
            },
            getById: async (id: string) => {
                const response = await organizationService.getOrganizationById(id);
                return { data: response.data! };
            },
            create: async (data: any) => {
                const response = await organizationService.createOrganization(data);
                return {
                    data: response.data!,
                    message: response.message || undefined,
                };
            },
            update: async (id: string, data: any) => {
                const response = await organizationService.updateOrganization(id, data);
                return {
                    data: response.data!,
                    message: response.message || undefined,
                };
            },
            delete: async (id: string) => {
                const response = await organizationService.deleteOrganization(id);
                return { message: response.message || undefined };
            },
            restore: async (id: string) => {
                const response = await organizationService.restoreOrganization(id);
                return { message: response.message || undefined };
            },
            hardDelete: async (id: string) => {
                const response = await organizationService.hardDeleteOrganization(id);
                return { message: response.message || undefined };
            },
        },

        // Data fetching
        useQuery: useOrganizationsQuery,

        // Table columns - factory function that creates columns with action handlers
        columns: (handlers) => createOrganizationColumns(handlers),

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
                <AddOrganizationDialog
                    open={props.open}
                    onOpenChange={props.onOpenChange}
                    onOrganizationCreated={props.onSuccess}
                />
            ),
            edit: (props) => (
                <UpdateOrganizationDialog
                    organizationId={props.entity.id}
                    open={props.open}
                    onOpenChange={props.onOpenChange}
                    onOrganizationUpdated={props.onSuccess}
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
            defaultVisibleColumns: ["status", "name", "domain", "description", "settings", "createdAt", "updatedAt"],
            advancedFiltering: true,
            virtualScrolling: true,
            virtualScrollingThreshold: 50,
            estimatedRowHeight: 60,
            virtualContainerHeight: "600px",
        },

        // Custom messages
        messages: {
            emptyState: "Get started by creating your first organization",
            deleteConfirm: (organization) => organization.name,
        },

        // Empty state icon
        emptyIcon: "building",
    };
}

// Export column creator for backward compatibility
export { createOrganizationColumns };
