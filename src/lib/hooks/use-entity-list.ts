import { useState, useCallback, useMemo } from "react";
import { usePagination, useDialogState } from "@/lib/hooks";
import { useEntitySort, type SortConfig } from "@/lib/hooks/use-entity-sort";
import type { EntityListState, UseEntityListConfig } from "@/lib/types/entity-config";

/**
 * Generic hook for managing entity list state and operations
 * 
 * This hook centralizes all state management for entity lists including:
 * - Pagination, search, and filtering
 * - Selection and bulk operations
 * - Dialog states for CRUD operations
 * - Event handlers for all user interactions
 * 
 * @example
 * ```tsx
 * const entityList = useEntityList({
 *   config: usersConfig,
 *   initialPage: 1,
 *   initialPageSize: 10
 * });
 * 
 * // Access data
 * const { entities, isLoading, meta } = entityList;
 * 
 * // Use handlers
 * <Button onClick={() => entityList.handlers.onEdit(user)}>Edit</Button>
 * ```
 */
export function useEntityList<T extends { id: string; active?: boolean }>({
    config,
    initialPage = 1,
    initialPageSize = 10,
    initialSearch = "",
    additionalParams = {},
}: UseEntityListConfig<T>): EntityListState<T> {
    // ==================== State Management ====================

    // Pagination state
    const pagination = usePagination({
        initialPage,
        initialPageSize,
    });

    // Search and filter state
    const [search, setSearch] = useState(initialSearch);
    const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

    // Selection state
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Current entity being acted upon
    const [currentEntity, setCurrentEntity] = useState<T | null>(null);

    // Dialog states
    const createDialog = useDialogState();
    const editDialog = useDialogState();
    const deleteDialog = useDialogState();
    const restoreDialog = useDialogState();
    const hardDeleteDialog = useDialogState();
    const bulkDeleteDialog = useDialogState();

    // ==================== Data Fetching ====================

    // Build query parameters
    const queryParams = useMemo(() => ({
        page: pagination.page,
        size: pagination.pageSize,
        search,
        ...activeFilters,
        ...additionalParams,
    }), [pagination.page, pagination.pageSize, search, activeFilters, additionalParams]);

    // Fetch data using the provided query hook
    const { data, isLoading, isError, error, refetch } = config.useQuery(queryParams);

    // Extract entities and metadata
    const rawEntities = useMemo(() => data?.data || [], [data]);
    const meta = useMemo(() => data?.meta, [data]);

    // ==================== Sorting ====================

    // Apply client-side sorting
    const { sortConfig, handleSort, resetSort, sortedData } = useEntitySort({
        data: rawEntities,
        initialSort: config.initialSort,
    });

    // Use sorted data as final entities
    const entities = sortedData;

    // ==================== Event Handlers ====================

    /**
     * Handle search change with auto-reset to page 1
     */
    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
        pagination.setPage(1);
    }, [pagination]);

    /**
     * Handle filter change with auto-reset to page 1
     */
    const handleFilterChange = useCallback((key: string, value: any) => {
        setActiveFilters(prev => ({
            ...prev,
            [key]: value,
        }));
        pagination.setPage(1);
    }, [pagination]);

    /**
     * Handle selection change
     */
    const handleSelectionChange = useCallback((ids: Set<string>) => {
        setSelectedIds(ids);
    }, []);

    /**
     * Open create dialog
     */
    const handleCreate = useCallback(() => {
        setCurrentEntity(null);
        createDialog.open();
    }, [createDialog]);

    /**
     * Open edit dialog for specific entity
     */
    const handleEdit = useCallback((entity: T) => {
        setCurrentEntity(entity);
        editDialog.open();
    }, [editDialog]);

    /**
     * Open delete confirmation dialog
     */
    const handleDelete = useCallback((entity: T) => {
        setCurrentEntity(entity);
        deleteDialog.open();
    }, [deleteDialog]);

    /**
     * Open restore confirmation dialog
     */
    const handleRestore = useCallback((entity: T) => {
        setCurrentEntity(entity);
        restoreDialog.open();
    }, [restoreDialog]);

    /**
     * Open hard delete confirmation dialog
     */
    const handleHardDelete = useCallback((entity: T) => {
        setCurrentEntity(entity);
        hardDeleteDialog.open();
    }, [hardDeleteDialog]);

    /**
     * Open bulk delete confirmation dialog
     */
    const handleBulkDelete = useCallback(() => {
        if (selectedIds.size === 0) return;
        bulkDeleteDialog.open();
    }, [selectedIds, bulkDeleteDialog]);

    // ==================== Return API ====================

    return {
        // Data
        entities,
        meta,
        isLoading,
        isError,
        error,

        // Pagination
        pagination: {
            page: pagination.page,
            pageSize: pagination.pageSize,
            setPage: pagination.setPage,
            setPageSize: pagination.setPageSize,
        },

        // Filters
        search,
        setSearch,
        activeFilters,
        setFilter: handleFilterChange,

        // Selection
        selectedIds,
        setSelectedIds,

        // Sorting
        sortConfig,
        onSort: handleSort,
        resetSort,

        // Dialogs
        dialogs: {
            create: createDialog,
            edit: editDialog,
            delete: deleteDialog,
            restore: restoreDialog,
            hardDelete: hardDeleteDialog,
            bulkDelete: bulkDeleteDialog,
        },

        // Current entity
        currentEntity,
        setCurrentEntity,

        // Handlers
        handlers: {
            onCreate: handleCreate,
            onEdit: handleEdit,
            onDelete: handleDelete,
            onRestore: handleRestore,
            onHardDelete: handleHardDelete,
            onBulkDelete: handleBulkDelete,
            onSearchChange: handleSearchChange,
            onFilterChange: handleFilterChange,
            onSelectionChange: handleSelectionChange,
            refetch,
        },
    };
}
