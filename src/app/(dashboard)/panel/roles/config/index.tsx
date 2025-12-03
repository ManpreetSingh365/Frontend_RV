import { EntityConfig } from "@/lib/types/entity-config";
import { createRoleColumns, Role } from "./columns";
import * as roleService from "@/lib/service/role.services";
import { useRolesPaginatedQuery } from "@/lib/hooks";
import AddRoleDialog from "../components/dialogs/AddRoleDialog";
import UpdateRoleDialog from "../components/dialogs/UpdateRoleDialog";

/**
 * Complete entity configuration for Roles
 * This drives the entire CRUD UI via the generic EntityList component
 */
export function createRolesConfig(): EntityConfig<Role> {
    return {
        // Entity metadata
        entityName: "role",
        entityNamePlural: "roles",

        // Service layer - wrap API responses to match EntityService interface
        service: {
            list: async (params: any) => {
                const response = await roleService.getRoles(params);
                return {
                    data: response.data || [],
                    meta: response.meta,
                };
            },
            getById: async (id: string) => {
                const response = await roleService.getRoleById(id);
                return { data: response.data! };
            },
            create: async (data: any) => {
                const response = await roleService.createRole(data);
                return {
                    data: response.data!,
                    message: response.message || undefined,
                };
            },
            update: async (id: string, data: any) => {
                const response = await roleService.updateRole(id, data);
                return {
                    data: response.data!,
                    message: response.message || undefined,
                };
            },
            delete: async (id: string) => {
                const response = await roleService.deleteRole(id);
                return { message: response.message || undefined };
            },
            restore: async (id: string) => {
                const response = await roleService.restoreRole(id);
                return { message: response.message || undefined };
            },
            hardDelete: async (id: string) => {
                const response = await roleService.hardDeleteRole(id);
                return { message: response.message || undefined };
            },
        },

        // Data fetching
        useQuery: useRolesPaginatedQuery,

        // Table columns - factory function that creates columns with action handlers
        columns: (handlers) => createRoleColumns(handlers),

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
                <AddRoleDialog
                    open={props.open}
                    onOpenChange={props.onOpenChange}
                    onRoleCreated={props.onSuccess}
                />
            ),
            edit: (props) => (
                <UpdateRoleDialog
                    roleId={props.entity.id}
                    open={props.open}
                    onOpenChange={props.onOpenChange}
                    onRoleUpdated={props.onSuccess}
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
            defaultVisibleColumns: ["status", "name", "description", "level", "users", "permissions", "createdAt"],
            advancedFiltering: true,
            virtualScrolling: true,
            virtualScrollingThreshold: 50,
            estimatedRowHeight: 60,
            virtualContainerHeight: "600px",
        },

        // Custom messages
        messages: {
            emptyState: "Get started by creating your first role",
            deleteConfirm: (role) => role.name,
        },

        // Empty state icon
        emptyIcon: "shield",
    };
}

// Export column creator for backward compatibility
export { createRoleColumns };
