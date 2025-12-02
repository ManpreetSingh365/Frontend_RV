"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { usePagination, useDialogState } from "@/lib/hooks";
import { FilterBar, ConfirmDialog } from "@/components/shared";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useRolesPaginatedQuery } from "@/lib/hooks/use-queries";
import PageHeader from "./components/PageHeader";
import RoleTable from "./components/RoleTable";
import UpdateRoleDialog from "./components/dialogs/UpdateRoleDialog";
import type { FilterConfig } from "@/lib/types/entity";
import { Button } from "@/components/ui/button";
import { deleteRole, hardDeleteRole, restoreRole } from "@/lib/service/role.services";

interface RolesListProps {
    initialPage?: number;
    initialSearch?: string;
    initialPageSize?: number;
}

export default function RolesList({
    initialPage = 1,
    initialSearch = "",
    initialPageSize = 10,
}: RolesListProps) {
    // State management with shared hooks
    const pagination = usePagination({
        initialPage,
        initialPageSize,
    });

    const [search, setSearch] = useState(initialSearch);
    const [viewMode, setViewMode] = useState("hierarchy");
    const [roleToDelete, setRoleToDelete] = useState<any | null>(null);
    const [roleToEdit, setRoleToEdit] = useState<any | null>(null);
    const [roleToRestore, setRoleToRestore] = useState<any | null>(null);
    const [roleToHardDelete, setRoleToHardDelete] = useState<any | null>(null);
    const [selectedRoleIds, setSelectedRoleIds] = useState<Set<string>>(new Set());

    const deleteDialog = useDialogState();
    const editDialog = useDialogState();
    const restoreDialog = useDialogState();
    const hardDeleteDialog = useDialogState();
    const bulkDeleteDialog = useDialogState();

    // Data fetching with TanStack Query
    const { data, isLoading, isError, error, refetch } = useRolesPaginatedQuery({
        page: pagination.page,
        size: pagination.pageSize,
        search,
        viewMode,
    });

    const roles = data?.data || [];
    const meta = data?.meta;

    // Handle search with auto-reset to page 1
    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
        pagination.setPage(1);
    }, [pagination]);

    // Handle view mode change
    const handleViewModeChange = useCallback((value: string | string[]) => {
        const modeValue = Array.isArray(value) ? value[0] : value;
        setViewMode(modeValue);
        pagination.setPage(1);
    }, [pagination]);

    // Handle edit with dialog
    const handleEditClick = useCallback((role: any) => {
        setRoleToEdit(role);
        editDialog.open();
    }, [editDialog]);

    // ... (rest of handlers)

    // Filter configuration
    const filters: FilterConfig[] = [
        {
            type: "select",
            label: "View Mode",
            value: viewMode,
            onChange: handleViewModeChange,
            options: [
                { label: "Hierarchy", value: "hierarchy" },
                { label: "Created By", value: "createdBy" },
                { label: "Both", value: "both" },
            ],
        },
    ];

    // Handle delete with confirmation
    const handleDeleteClick = useCallback((role: any) => {
        setRoleToDelete(role);
        deleteDialog.open();
    }, [deleteDialog]);

    const handleDeleteConfirm = useCallback(async () => {
        if (!roleToDelete) return;

        try {
            // Implement delete logic here
            const response = await deleteRole(roleToDelete.id);
            toast.success(response.message || "Role deleted successfully");
            await refetch();
            deleteDialog.close();
            setRoleToDelete(null);
        } catch (error: any) {
            console.error("Delete failed:", error);
            const errorMessage = error?.response?.data?.messages?.[0] ||
                error?.response?.data?.message ||
                error?.message ||
                "Failed to delete role";
            toast.error(errorMessage);
        }
    }, [roleToDelete, refetch, deleteDialog]);

    // Handle restore
    const handleRestoreClick = useCallback((role: any) => {
        setRoleToRestore(role);
        restoreDialog.open();
    }, [restoreDialog]);

    const handleRestoreConfirm = useCallback(async () => {
        if (!roleToRestore) return;

        try {
            await restoreRole(roleToRestore.id);
            toast.success("Role restored successfully");
            await refetch();
            restoreDialog.close();
            setRoleToRestore(null);
        } catch (error: any) {
            console.error("Restore failed:", error);
            const errorMessage = error?.response?.data?.messages?.[0] ||
                error?.response?.data?.message ||
                error?.message ||
                "Failed to restore role";
            toast.error(errorMessage);
        }
    }, [roleToRestore, refetch, restoreDialog]);

    // Handle hard delete
    const handleHardDeleteClick = useCallback((role: any) => {
        setRoleToHardDelete(role);
        hardDeleteDialog.open();
    }, [hardDeleteDialog]);

    const handleHardDeleteConfirm = useCallback(async () => {
        if (!roleToHardDelete) return;

        try {
            await hardDeleteRole(roleToHardDelete.id);
            toast.success("Role permanently deleted");
            await refetch();
            hardDeleteDialog.close();
            setRoleToHardDelete(null);
        } catch (error: any) {
            console.error("Hard delete failed:", error);
            const errorMessage = error?.response?.data?.messages?.[0] ||
                error?.response?.data?.message ||
                error?.message ||
                "Failed to permanently delete role";
            toast.error(errorMessage);
        }
    }, [roleToHardDelete, refetch, hardDeleteDialog]);

    // Handle bulk delete
    const handleBulkDelete = useCallback(() => {
        if (selectedRoleIds.size === 0) return;
        bulkDeleteDialog.open();
    }, [selectedRoleIds, bulkDeleteDialog]);

    const handleBulkDeleteConfirm = useCallback(async () => {
        if (selectedRoleIds.size === 0) return;

        try {
            // Implement bulk delete logic here
            await Promise.all(Array.from(selectedRoleIds).map(id => deleteRole(id)));
            toast.success(`Successfully deleted ${selectedRoleIds.size} role(s)`);
            await refetch();
            setSelectedRoleIds(new Set());
            bulkDeleteDialog.close();
        } catch (error: any) {
            console.error("Bulk delete failed:", error);
            const errorMessage = error?.response?.data?.messages?.[0] ||
                error?.response?.data?.message ||
                error?.message ||
                "Failed to delete roles";
            toast.error(errorMessage);
        }
    }, [selectedRoleIds, refetch, bulkDeleteDialog]);

    // Handle selection change
    const handleSelectionChange = useCallback((selectedIds: Set<string>) => {
        setSelectedRoleIds(selectedIds);
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <div className="w-full max-w-full p-4 sm:p-6 md:p-8">
                <PageHeader onRoleCreated={refetch} />
                <FilterBar
                    searchValue={search}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Search roles by name..."
                />
                <LoadingState rows={6} />
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="w-full max-w-full p-4 sm:p-6 md:p-8">
                <PageHeader onRoleCreated={refetch} />
                <ErrorState
                    title="Failed to load roles"
                    message={(error as Error)?.message || "An error occurred"}
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    // Empty state
    if (!roles.length && !search) {
        return (
            <div className="w-full max-w-full p-4 sm:p-6 md:p-8">
                <PageHeader onRoleCreated={refetch} />
                <EmptyState
                    icon="shield"
                    title="No roles yet"
                    message="Get started by creating your first role"
                />
            </div>
        );
    }

    // Main content
    return (
        <div className="w-full max-w-full p-4 sm:p-6 md:p-8">
            {/* Header */}
            <PageHeader onRoleCreated={refetch} />

            {/* Filters and Bulk Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                <div className="flex-1 w-full">
                    <FilterBar
                        searchValue={search}
                        onSearchChange={handleSearchChange}
                        searchPlaceholder="Search by role name or description..."
                        filters={filters}
                    />
                </div>
                {selectedRoleIds.size > 0 && (
                    <Button
                        variant="destructive"
                        onClick={handleBulkDelete}
                        className="whitespace-nowrap"
                    >
                        Delete Selected ({selectedRoleIds.size})
                    </Button>
                )}
            </div>

            {/* Table Content */}
            <div>
                {/* Table */}
                {
                    roles.length === 0 ? (
                        <EmptyState
                            icon="search"
                            title="No roles found"
                            message="Try adjusting your search"
                        />
                    ) : (
                        <>
                            <RoleTable
                                roles={roles}
                                onDelete={handleDeleteClick}
                                onEdit={handleEditClick}
                                onSelectionChange={handleSelectionChange}
                                onRestore={handleRestoreClick}
                                onHardDelete={handleHardDeleteClick}
                            />

                            {/* Pagination */}
                            {meta && (
                                <DataTablePagination
                                    currentPage={pagination.page}
                                    totalPages={meta.totalPages}
                                    totalItems={meta.totalElements}
                                    pageSize={pagination.pageSize}
                                    onPageChange={pagination.setPage}
                                    onPageSizeChange={pagination.setPageSize}
                                />
                            )}
                        </>
                    )
                }
            </div >

            {/* Edit Role Dialog */}
            {
                roleToEdit && (
                    <UpdateRoleDialog
                        roleId={roleToEdit.id}
                        open={editDialog.isOpen}
                        onOpenChange={editDialog.toggle}
                        onRoleUpdated={refetch}
                    />
                )
            }

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialog.isOpen}
                onOpenChange={(isOpen) => isOpen ? deleteDialog.open() : deleteDialog.close()}
                title="Delete Role?"
                description={
                    roleToDelete ? (
                        <>
                            Are you sure you want to delete{" "}
                            <span className="font-semibold">{roleToDelete.name}</span>? This
                            action cannot be undone.
                        </>
                    ) : (
                        "This action cannot be undone."
                    )
                }
                onConfirm={handleDeleteConfirm}
                confirmText="Delete"
                variant="danger"
            />

            {/* Restore Confirmation Dialog */}
            <ConfirmDialog
                open={restoreDialog.isOpen}
                onOpenChange={(isOpen) => isOpen ? restoreDialog.open() : restoreDialog.close()}
                title="Restore Role?"
                description={
                    roleToRestore ? (
                        <>
                            Are you sure you want to restore{" "}
                            <span className="font-semibold">{roleToRestore.name}</span>?
                        </>
                    ) : (
                        "Are you sure you want to restore this role?"
                    )
                }
                onConfirm={handleRestoreConfirm}
                confirmText="Restore"
                variant="info"
            />

            {/* Hard Delete Confirmation Dialog */}
            <ConfirmDialog
                open={hardDeleteDialog.isOpen}
                onOpenChange={(isOpen) => isOpen ? hardDeleteDialog.open() : hardDeleteDialog.close()}
                title="Permanently Delete Role?"
                description={
                    roleToHardDelete ? (
                        <>
                            Are you sure you want to <span className="font-bold text-destructive">permanently delete</span>{" "}
                            <span className="font-semibold">{roleToHardDelete.name}</span>?
                            This action <span className="font-bold">cannot be undone</span>.
                        </>
                    ) : (
                        "This action cannot be undone."
                    )
                }
                onConfirm={handleHardDeleteConfirm}
                confirmText="Permanently Delete"
                variant="danger"
            />

            {/* Bulk Delete Confirmation Dialog */}
            <ConfirmDialog
                open={bulkDeleteDialog.isOpen}
                onOpenChange={(isOpen) => isOpen ? bulkDeleteDialog.open() : bulkDeleteDialog.close()}
                title="Delete Multiple Roles?"
                description={
                    <>
                        Are you sure you want to delete{" "}
                        <span className="font-semibold">{selectedRoleIds.size} role(s)</span>?
                        This action cannot be undone.
                    </>
                }
                onConfirm={handleBulkDeleteConfirm}
                confirmText="Delete All"
                variant="danger"
            />
        </div >
    );
}
