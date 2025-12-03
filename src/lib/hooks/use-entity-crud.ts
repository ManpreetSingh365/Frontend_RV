import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { EntityService } from "@/lib/types/entity-config";

/**
 * Configuration for useEntityCRUD hook
 */
interface UseEntityCRUDConfig<T> {
    /** Entity name for display in messages */
    entityName: string;
    /** Service layer with API operations */
    service: EntityService<T>;
    /** Callback after successful operation */
    onSuccess?: () => void;
}

/**
 * Result of a CRUD operation
 */
interface CRUDOperationResult {
    /** Whether operation is in progress */
    isPending: boolean;
    /** Global error message if any */
    error: string;
    /** Set global error */
    setError: (error: string) => void;
}

/**
 * Generic hook for entity CRUD operations
 * 
 * Provides handlers for create, update, delete, restore, and hard delete
 * with built-in error handling, loading states, and toast notifications
 * 
 * @example
 * ```tsx
 * const { performDelete, isPending } = useEntityCRUD({
 *   entityName: 'user',
 *   service: userService,
 *   onSuccess: refetch
 * });
 * 
 * <Button onClick={() => performDelete(user.id)} disabled={isPending}>
 *   Delete
 * </Button>
 * ```
 */
export function useEntityCRUD<T>({
    entityName,
    service,
    onSuccess,
}: UseEntityCRUDConfig<T>) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState("");

    /**
     * Generic operation executor with error handling
     */
    const executeOperation = useCallback(
        async (
            operation: () => Promise<any>,
            successMessage: string
        ): Promise<boolean> => {
            setIsPending(true);
            setError("");

            try {
                const response = await operation();
                toast.success(response?.message || successMessage);
                onSuccess?.();
                return true;
            } catch (err: any) {
                const errorMessage =
                    err?.response?.data?.messages?.[0] ||
                    err?.response?.data?.message ||
                    err?.message ||
                    `Failed to perform operation on ${entityName}`;

                setError(errorMessage);
                toast.error(errorMessage);
                return false;
            } finally {
                setIsPending(false);
            }
        },
        [entityName, onSuccess]
    );

    /**
     * Delete entity (soft delete)
     */
    const performDelete = useCallback(
        async (id: string): Promise<boolean> => {
            return executeOperation(
                () => service.delete(id),
                `${entityName.charAt(0).toUpperCase() + entityName.slice(1)} deleted successfully`
            );
        },
        [executeOperation, service, entityName]
    );

    /**
     * Restore soft-deleted entity
     */
    const performRestore = useCallback(
        async (id: string): Promise<boolean> => {
            if (!service.restore) {
                toast.error("Restore operation not supported");
                return false;
            }
            return executeOperation(
                () => service.restore!(id),
                `${entityName.charAt(0).toUpperCase() + entityName.slice(1)} restored successfully`
            );
        },
        [executeOperation, service, entityName]
    );

    /**
     * Permanently delete entity (hard delete)
     */
    const performHardDelete = useCallback(
        async (id: string): Promise<boolean> => {
            if (!service.hardDelete) {
                toast.error("Permanent delete operation not supported");
                return false;
            }
            return executeOperation(
                () => service.hardDelete!(id),
                `${entityName.charAt(0).toUpperCase() + entityName.slice(1)} permanently deleted`
            );
        },
        [executeOperation, service, entityName]
    );

    /**
     * Bulk delete entities
     */
    const performBulkDelete = useCallback(
        async (ids: string[]): Promise<boolean> => {
            return executeOperation(
                () => Promise.all(ids.map(id => service.delete(id))),
                `Successfully deleted ${ids.length} ${ids.length === 1 ? entityName : entityName + 's'}`
            );
        },
        [executeOperation, service, entityName]
    );

    return {
        isPending,
        error,
        setError,
        performDelete,
        performRestore,
        performHardDelete,
        performBulkDelete,
    };
}
