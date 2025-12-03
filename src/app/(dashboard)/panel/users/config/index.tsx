import { EntityConfig } from "@/lib/types/entity-config";
import { createUserColumns, User } from "./columns";
import * as userService from "@/lib/service/user.service";
import { useUsersQuery } from "@/lib/hooks";
import AddUserDialog from "../components/dialogs/AddUserDialog";
import UpdateUserDialog from "../components/dialogs/UpdateUserDialog";

/**
 * Complete entity configuration for Users
 * This drives the entire CRUD UI via the generic EntityList component
 */
export function createUsersConfig(rolesData?: any[]): EntityConfig<User> {
    return {
        // Entity metadata
        entityName: "user",
        entityNamePlural: "users",

        // Service layer - wrap API responses to match EntityService interface
        service: {
            list: async (params: any) => {
                const response = await userService.getUsers(params);
                return {
                    data: response.data || [],
                    meta: response.meta,
                };
            },
            getById: async (id: string) => {
                const response = await userService.getUserById(id);
                return { data: response.data! };
            },
            create: async (data: any) => {
                const response = await userService.createUser(data);
                return {
                    data: response.data!,
                    message: response.message || undefined,
                };
            },
            update: async (id: string, data: any) => {
                const response = await userService.updateUser(id, data);
                return {
                    data: response.data!,
                    message: response.message || undefined,
                };
            },
            delete: async (id: string) => {
                const response = await userService.deleteUser(id);
                return { message: response.message || undefined };
            },
            restore: async (id: string) => {
                const response = await userService.restoreUser(id);
                return { message: response.message || undefined };
            },
            hardDelete: async (id: string) => {
                const response = await userService.hardDeleteUser(id);
                return { message: response.message || undefined };
            },
        },

        // Data fetching
        useQuery: useUsersQuery,

        // Table columns - factory function that creates columns with action handlers
        columns: (handlers) => createUserColumns(handlers),

        // Filters
        filters: [
            {
                id: "role",
                type: "select",
                label: "Role",
                value: "all",
                onChange: () => { }, // Will be overridden by EntityList
                options: [
                    { label: "All", value: "all" },
                    ...(rolesData?.map((role: any) => ({
                        label: role.name,
                        value: role.name,
                    })) || []),
                ],
            },
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
                <AddUserDialog
                    open={props.open}
                    onOpenChange={props.onOpenChange}
                    onUserCreated={props.onSuccess}
                />
            ),
            edit: (props) => (
                <UpdateUserDialog
                    userId={props.entity.id}
                    open={props.open}
                    onOpenChange={props.onOpenChange}
                    onUserUpdated={props.onSuccess}
                />
            ),
        },

        // Features
        features: {
            softDelete: true,
            hardDelete: true,
            bulkOperations: true,
            selection: true,
        },

        // Custom messages
        messages: {
            emptyState: "Get started by creating your first user",
            deleteConfirm: (user) => `${user.firstName} ${user.lastName}`,
        },

        // Empty state icon
        emptyIcon: "users",
    };
}

// Export column creator for backward compatibility
export { createUserColumns };
