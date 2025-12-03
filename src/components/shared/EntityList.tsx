"use client";

import { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FilterBar, DataTable, ExportButton } from "@/components/shared";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { EntityCRUDDialogs } from "./EntityCRUDDialogs";
import { useEntityList } from "@/lib/hooks";
import type { EntityConfig } from "@/lib/types/entity-config";

interface EntityListProps<T extends { id: string; active?: boolean }> {
    /** Entity configuration */
    config: EntityConfig<T>;
    /** Page title */
    title: string;
    /** Page description */
    description?: string;
    /** Initial page number */
    initialPage?: number;
    /** Initial page size */
    initialPageSize?: number;
    /** Initial search term */
    initialSearch?: string;
    /** Additional query parameters */
    additionalParams?: Record<string, any>;
}

/**
 * Generic Entity List Container
 * 
 * A complete, production-ready list view for any entity type.
 * Handles pagination, search, filtering, selection, and all CRUD operations.
 * 
 * @example
 * ```tsx
 * <EntityList
 *   config={usersConfig}
 *   title="Users"
 *   description="Manage system users"
 *   initialPage={1}
 *   initialPageSize={10}
 * />
 * ```
 */
export function EntityList<T extends { id: string; active?: boolean }>({
    config,
    title,
    description,
    initialPage = 1,
    initialPageSize = 10,
    initialSearch = "",
    additionalParams,
}: EntityListProps<T>) {
    // Use the generic entity list hook
    const entityList = useEntityList({
        config,
        initialPage,
        initialPageSize,
        initialSearch,
        additionalParams,
    });

    const {
        entities,
        meta,
        isLoading,
        isError,
        error,
        pagination,
        search,
        activeFilters,
        selectedIds,
        dialogs,
        currentEntity,
        handlers,
        setCurrentEntity,
    } = entityList;

    const features = config.features || {};

    // Resolve columns - if it's a function, call it with handlers
    const columns = useMemo(() => {
        if (typeof config.columns === 'function') {
            return config.columns({
                onEdit: handlers.onEdit,
                onDelete: handlers.onDelete,
                onRestore: features.softDelete ? handlers.onRestore : undefined,
                onHardDelete: features.hardDelete ? handlers.onHardDelete : undefined,
            });
        }
        return config.columns;
    }, [config.columns, handlers, features]);

    // Build filter configurations with dynamic data
    const filterConfigs = config.filters?.map((filter) => ({
        ...filter,
        value: activeFilters[filter.id!] !== undefined ? activeFilters[filter.id!] : filter.value,
        onChange: (value: string | string[]) => {
            if (filter.id) {
                handlers.onFilterChange(filter.id, value);
            }
        },
    })) || [];

    // Reset current entity when dialogs close
    const handleDialogClose = useCallback(() => {
        setCurrentEntity(null);
    }, [setCurrentEntity]);

    // Loading state
    if (isLoading) {
        return (
            <div className="w-full max-w-full p-4 sm:p-6 md:p-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
                            {description && (
                                <p className="text-sm text-muted-foreground mt-1">{description}</p>
                            )}
                        </div>
                        <Button size="sm" disabled>
                            <Plus className="mr-2 h-4 w-4" />
                            Add New {config.entityName.charAt(0).toUpperCase() + config.entityName.slice(1)}
                        </Button>
                    </div>
                </div>

                <FilterBar
                    searchValue={search}
                    onSearchChange={handlers.onSearchChange}
                    searchPlaceholder={`Search ${config.entityNamePlural}...`}
                    filters={filterConfigs}
                />
                <LoadingState rows={8} />
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="w-full max-w-full p-4 sm:p-6 md:p-8">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
                    {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
                </div>
                <ErrorState
                    title={`Failed to load ${config.entityNamePlural}`}
                    message={error?.message || "An error occurred"}
                    onRetry={handlers.refetch}
                />
            </div>
        );
    }

    // Check for empty state
    const isEmptyState = entities.length === 0 && !search &&
        (!config.filters || config.filters.every(f => !f.value || f.value === 'all'));

    // Empty state (no data at all)
    if (isEmptyState) {
        return (
            <div className="w-full max-w-full p-4 sm:p-6 md:p-8">
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
                            {description && (
                                <p className="text-sm text-muted-foreground mt-1">{description}</p>
                            )}
                        </div>
                        <Button onClick={handlers.onCreate} size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New {config.entityName.charAt(0).toUpperCase() + config.entityName.slice(1)}
                        </Button>
                    </div>
                </div>
                <EmptyState
                    icon={config.emptyIcon || "database"}
                    title={`No ${config.entityNamePlural} yet`}
                    message={config.messages?.emptyState || `Get started by creating your first ${config.entityName}`}
                />
            </div>
        );
    }

    // Main content
    return (
        <div className="w-full max-w-full p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
                        {description && (
                            <p className="text-sm text-muted-foreground mt-1">{description}</p>
                        )}
                    </div>
                    <Button onClick={handlers.onCreate} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New {config.entityName.charAt(0).toUpperCase() + config.entityName.slice(1)}
                    </Button>
                </div>
            </div>

            {/* Filters and Bulk Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                <div className="flex-1 w-full">
                    <FilterBar
                        searchValue={search}
                        onSearchChange={handlers.onSearchChange}
                        searchPlaceholder={`Search ${config.entityNamePlural}...`}
                        filters={filterConfigs}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <ExportButton
                        data={entities}
                        filename={config.entityNamePlural}
                        selectedIds={selectedIds}
                        disabled={isLoading}
                    />
                    {features.bulkOperations && selectedIds.size > 0 && (
                        <Button
                            variant="destructive"
                            onClick={handlers.onBulkDelete}
                            className="whitespace-nowrap"
                        >
                            Delete Selected ({selectedIds.size})
                        </Button>
                    )}
                </div>
            </div>

            {/* Table Content */}
            <div>
                {entities.length === 0 ? (
                    <EmptyState
                        icon="search"
                        title={`No ${config.entityNamePlural} found`}
                        message="Try adjusting your search or filters"
                    />
                ) : (
                    <>
                        <DataTable
                            columns={columns}
                            data={entities}
                            selectable={features.selection !== false}
                            onSelectionChange={handlers.onSelectionChange}
                            emptyMessage={`No ${config.entityNamePlural} found. Try adjusting your search or filters.`}
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
                )}
            </div>

            {/* CRUD Dialogs */}
            <EntityCRUDDialogs
                config={config}
                currentEntity={currentEntity}
                selectedIds={selectedIds}
                dialogs={dialogs}
                onSuccess={handlers.refetch}
                onClose={handleDialogClose}
            />
        </div>
    );
}
