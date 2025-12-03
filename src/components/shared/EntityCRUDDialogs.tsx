"use client";

import { ReactNode } from "react";
import { ConfirmDialog } from "@/components/shared";
import type { EntityConfig } from "@/lib/types/entity-config";
import { useEntityCRUD } from "@/lib/hooks";

interface EntityCRUDDialogsProps<T extends { id: string; active?: boolean }> {
    /** Entity configuration */
    config: EntityConfig<T>;
    /** Current entity being acted upon */
    currentEntity: T | null;
    /** Selected entity IDs for bulk operations */
    selectedIds: Set<string>;
    /** Dialog states */
    dialogs: {
        create: { isOpen: boolean; open: () => void; close: () => void };
        edit: { isOpen: boolean; open: () => void; close: () => void };
        delete: { isOpen: boolean; open: () => void; close: () => void };
        restore: { isOpen: boolean; open: () => void; close: () => void };
        hardDelete: { isOpen: boolean; open: () => void; close: () => void };
        bulkDelete: { isOpen: boolean; open: () => void; close: () => void };
    };
    /** Callback after successful operation */
    onSuccess: () => void;
    /** Reset current entity */
    onClose: () => void;
}

/**
 * Generic CRUD dialogs component
 * Renders all necessary dialogs for entity operations
 */
export function EntityCRUDDialogs<T extends { id: string; active?: boolean }>({
    config,
    currentEntity,
    selectedIds,
    dialogs,
    onSuccess,
    onClose,
}: EntityCRUDDialogsProps<T>) {
    const {
        performDelete,
        performRestore,
        performHardDelete,
        performBulkDelete,
    } = useEntityCRUD({
        entityName: config.entityName,
        service: config.service,
        onSuccess: () => {
            onSuccess();
            onClose();
        },
    });

    // Get entity display name (e.g., "User: John Doe")
    const getEntityDisplayName = (entity: T): ReactNode => {
        if (config.messages?.deleteConfirm) {
            return config.messages.deleteConfirm(entity);
        }
        return `this ${config.entityName}`;
    };

    // Handlers
    const handleDeleteConfirm = async () => {
        if (!currentEntity) return;
        const success = await performDelete(currentEntity.id);
        if (success) {
            dialogs.delete.close();
        }
    };

    const handleRestoreConfirm = async () => {
        if (!currentEntity) return;
        const success = await performRestore(currentEntity.id);
        if (success) {
            dialogs.restore.close();
        }
    };

    const handleHardDeleteConfirm = async () => {
        if (!currentEntity) return;
        const success = await performHardDelete(currentEntity.id);
        if (success) {
            dialogs.hardDelete.close();
        }
    };

    const handleBulkDeleteConfirm = async () => {
        const ids = Array.from(selectedIds);
        const success = await performBulkDelete(ids);
        if (success) {
            dialogs.bulkDelete.close();
        }
    };

    const features = config.features || {};

    return (
        <>
            {/* Create Dialog */}
            {config.dialogs.create({
                open: dialogs.create.isOpen,
                onOpenChange: (open) => (open ? dialogs.create.open() : dialogs.create.close()),
                onSuccess: () => {
                    onSuccess();
                    dialogs.create.close();
                },
            })}

            {/* Edit Dialog */}
            {currentEntity && config.dialogs.edit({
                entity: currentEntity,
                open: dialogs.edit.isOpen,
                onOpenChange: (open) => (open ? dialogs.edit.open() : dialogs.edit.close()),
                onSuccess: () => {
                    onSuccess();
                    dialogs.edit.close();
                    onClose();
                },
            })}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={dialogs.delete.isOpen}
                onOpenChange={(isOpen) => (isOpen ? dialogs.delete.open() : dialogs.delete.close())}
                title={`Delete ${config.entityName.charAt(0).toUpperCase() + config.entityName.slice(1)}?`}
                description={
                    currentEntity ? (
                        <>
                            Are you sure you want to delete{" "}
                            <span className="font-semibold">{getEntityDisplayName(currentEntity)}</span>?
                            This action cannot be undone.
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
            {features.softDelete && (
                <ConfirmDialog
                    open={dialogs.restore.isOpen}
                    onOpenChange={(isOpen) => (isOpen ? dialogs.restore.open() : dialogs.restore.close())}
                    title={`Restore ${config.entityName.charAt(0).toUpperCase() + config.entityName.slice(1)}?`}
                    description={
                        currentEntity ? (
                            <>
                                Are you sure you want to restore{" "}
                                <span className="font-semibold">{getEntityDisplayName(currentEntity)}</span>?
                            </>
                        ) : (
                            `Are you sure you want to restore this ${config.entityName}?`
                        )
                    }
                    onConfirm={handleRestoreConfirm}
                    confirmText="Restore"
                    variant="info"
                />
            )}

            {/* Hard Delete Confirmation Dialog */}
            {features.hardDelete && (
                <ConfirmDialog
                    open={dialogs.hardDelete.isOpen}
                    onOpenChange={(isOpen) =>
                        isOpen ? dialogs.hardDelete.open() : dialogs.hardDelete.close()
                    }
                    title={`Permanently Delete ${config.entityName.charAt(0).toUpperCase() + config.entityName.slice(1)}?`}
                    description={
                        currentEntity ? (
                            <>
                                Are you sure you want to{" "}
                                <span className="font-bold text-destructive">permanently delete</span>{" "}
                                <span className="font-semibold">{getEntityDisplayName(currentEntity)}</span>?
                                This action <span className="font-bold">cannot be undone</span> and will remove all
                                associated data.
                            </>
                        ) : (
                            "This action cannot be undone."
                        )
                    }
                    onConfirm={handleHardDeleteConfirm}
                    confirmText="Permanently Delete"
                    variant="danger"
                />
            )}

            {/* Bulk Delete Confirmation Dialog */}
            {features.bulkOperations && (
                <ConfirmDialog
                    open={dialogs.bulkDelete.isOpen}
                    onOpenChange={(isOpen) =>
                        isOpen ? dialogs.bulkDelete.open() : dialogs.bulkDelete.close()
                    }
                    title={`Delete Multiple ${config.entityNamePlural.charAt(0).toUpperCase() + config.entityNamePlural.slice(1)}?`}
                    description={
                        <>
                            Are you sure you want to delete{" "}
                            <span className="font-semibold">
                                {selectedIds.size} {selectedIds.size === 1 ? config.entityName : config.entityNamePlural}
                            </span>
                            ? This action cannot be undone.
                        </>
                    }
                    onConfirm={handleBulkDeleteConfirm}
                    confirmText="Delete All"
                    variant="danger"
                />
            )}
        </>
    );
}
