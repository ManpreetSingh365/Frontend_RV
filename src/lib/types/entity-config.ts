import type { ColumnDef, FilterConfig } from "./entity";
import type { ReactNode } from "react";

/**
 * Entity service configuration
 * Defines all API operations for an entity type
 */
export interface EntityService<T> {
    /** Fetch paginated list of entities */
    list: (params: any) => Promise<{ data: T[]; meta?: any }>;
    /** Get single entity by ID */
    getById: (id: string) => Promise<{ data: T }>;
    /** Create new entity */
    create: (data: any) => Promise<{ data: T; message?: string }>;
    /** Update existing entity */
    update: (id: string, data: any) => Promise<{ data: T; message?: string }>;
    /** Soft delete entity */
    delete: (id: string) => Promise<{ message?: string }>;
    /** Restore soft-deleted entity */
    restore?: (id: string) => Promise<{ message?: string }>;
    /** Permanently delete entity */
    hardDelete?: (id: string) => Promise<{ message?: string }>;
}

/**
 * Entity configuration for the generic list system
 * This is the main configuration object that drives the entire CRUD UI
 */
export interface EntityConfig<T extends { id: string; active?: boolean }> {
    /** Entity type name (singular, lowercase) for display */
    entityName: string;
    /** Entity type name (plural, lowercase) */
    entityNamePlural: string;
    /** Service layer with all API operations */
    service: EntityService<T>;
    /** Query hook for fetching data with TanStack Query */
    useQuery: (params: any) => {
        data: { data: T[]; meta?: any } | undefined;
        isLoading: boolean;
        isError: boolean;
        error: Error | null;
        refetch: () => void;
    };
    /** Column definitions for the data table - can be array or factory function */
    columns:
    | ColumnDef<T>[]
    | ((handlers: {
        onEdit: (entity: T) => void;
        onDelete: (entity: T) => void;
        onRestore?: (entity: T) => void;
        onHardDelete?: (entity: T) => void;
    }) => ColumnDef<T>[]);
    /** Filter configurations for the filter bar */
    filters?: FilterConfig[];
    /** Custom dialog components for create/edit */
    dialogs: {
        /** Dialog for creating new entity */
        create: (props: EntityDialogProps) => ReactNode;
        /** Dialog for editing existing entity */
        edit: (props: EntityEditDialogProps<T>) => ReactNode;
    };
    /** Feature flags */
    features?: {
        /** Enable soft delete/restore functionality */
        softDelete?: boolean;
        /** Enable hard delete functionality */
        hardDelete?: boolean;
        /** Enable bulk operations */
        bulkOperations?: boolean;
        /** Enable row selection */
        selection?: boolean;
        /** Enable column customization (show/hide columns) */
        columnCustomization?: boolean;
        /** Default visible columns (if customization enabled) */
        defaultVisibleColumns?: string[];
        /** Enable advanced filtering */
        advancedFiltering?: boolean;
        /** Enable virtual scrolling for large datasets */
        virtualScrolling?: boolean;
        /** Threshold for activating virtual scrolling (default: 100) */
        virtualScrollingThreshold?: number;
        /** Estimated row height for virtual scrolling (default: 60px) */
        estimatedRowHeight?: number;
        /** Container height for virtual table (default: "600px") */
        virtualContainerHeight?: string;
    };
    /** Custom messages */
    messages?: {
        emptyState?: string;
        deleteConfirm?: (entity: T) => string;
        restoreConfirm?: (entity: T) => string;
        hardDeleteConfirm?: (entity: T) => string;
    };
    /** Icon for empty state */
    emptyIcon?: string;
    /** Initial sort configuration */
    initialSort?: { column: string | null; direction: "asc" | "desc" | null };
}

/**
 * Props for entity create dialog
 */
export interface EntityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

/**
 * Props for entity edit dialog
 */
export interface EntityEditDialogProps<T> {
    entity: T;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

/**
 * State returned by useEntityList hook
 */
export interface EntityListState<T> {
    // Data
    entities: T[];
    meta?: any;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;

    // Pagination
    pagination: {
        page: number;
        pageSize: number;
        setPage: (page: number) => void;
        setPageSize: (size: number) => void;
    };

    // Filters
    search: string;
    setSearch: (search: string) => void;
    activeFilters: Record<string, any>;
    setFilter: (key: string, value: any) => void;

    // Selection
    selectedIds: Set<string>;
    setSelectedIds: (ids: Set<string>) => void;

    // Sorting
    sortConfig: { column: string | null; direction: "asc" | "desc" | null };
    onSort: (column: string) => void;
    resetSort: () => void;

    // Dialogs
    dialogs: {
        create: { isOpen: boolean; open: () => void; close: () => void };
        edit: { isOpen: boolean; open: () => void; close: () => void };
        delete: { isOpen: boolean; open: () => void; close: () => void };
        restore: { isOpen: boolean; open: () => void; close: () => void };
        hardDelete: { isOpen: boolean; open: () => void; close: () => void };
        bulkDelete: { isOpen: boolean; open: () => void; close: () => void };
    };

    // Current action targets
    currentEntity: T | null;
    setCurrentEntity: (entity: T | null) => void;

    // Handlers
    handlers: {
        onCreate: () => void;
        onEdit: (entity: T) => void;
        onDelete: (entity: T) => void;
        onRestore: (entity: T) => void;
        onHardDelete: (entity: T) => void;
        onBulkDelete: () => void;
        onSearchChange: (value: string) => void;
        onFilterChange: (key: string, value: any) => void;
        onSelectionChange: (ids: Set<string>) => void;
        refetch: () => void;
    };
}

/**
 * Configuration for useEntityList hook
 */
export interface UseEntityListConfig<T extends { id: string }> {
    /** Entity configuration */
    config: EntityConfig<T>;
    /** Initial page number */
    initialPage?: number;
    /** Initial page size */
    initialPageSize?: number;
    /** Initial search term */
    initialSearch?: string;
    /** Additional query parameters */
    additionalParams?: Record<string, any>;
}
