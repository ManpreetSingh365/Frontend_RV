"use client";

import { useMemo, useState } from "react";
import { EntityList } from "@/components/shared";
import { createUsersConfig } from "./config";
import { useRolesQuery } from "@/lib/hooks";
import ResetPasswordDialog from "./components/dialogs/ResetPasswordDialog";
import type { User } from "./config/columns";

interface UsersListProps {
    initialPage?: number;
    initialSearch?: string;
    initialPageSize?: number;
}

/**
 * Users List Component
 * Uses the generic EntityList with Users-specific configuration
 * Extended to include Reset Password functionality
 */
export default function UsersList({
    initialPage = 1,
    initialSearch = "",
    initialPageSize = 10,
}: UsersListProps) {
    // Fetch roles for filter dropdown
    const { data: rolesList } = useRolesQuery({ size: 100 });

    // Reset Password Dialog state
    const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
    const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);

    // Handle Reset Password action
    const handleResetPassword = (user: User) => {
        setResetPasswordUser(user);
        setResetPasswordDialogOpen(true);
    };

    const handleResetPasswordClose = () => {
        setResetPasswordDialogOpen(false);
        setResetPasswordUser(null);
    };

    // Create configuration with roles data and custom reset password handler
    const config = useMemo(() => {
        const baseConfig = createUsersConfig(rolesList);

        // Extend columns to include reset password handler
        const originalColumns = baseConfig.columns;
        const extendedColumns = typeof originalColumns === 'function'
            ? (handlers: any) => originalColumns({
                ...handlers,
                onResetPassword: handleResetPassword,
            })
            : originalColumns;

        return {
            ...baseConfig,
            columns: extendedColumns,
        };
    }, [rolesList]);

    return (
        <>
            <EntityList
                config={config}
                title="Users Management"
                description="Manage system users and their permissions"
                initialPage={initialPage}
                initialSearch={initialSearch}
                initialPageSize={initialPageSize}
            />

            {/* Reset Password Dialog */}
            {resetPasswordUser && (
                <ResetPasswordDialog
                    userId={resetPasswordUser.id}
                    userName={`${resetPasswordUser.firstName} ${resetPasswordUser.lastName}`}
                    open={resetPasswordDialogOpen}
                    onOpenChange={handleResetPasswordClose}
                />
            )}
        </>
    );
}
