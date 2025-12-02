/**
 * Centralized Type Definitions for Entity Management
 * Used across all entity modules (Users, Roles, Devices, etc.)
 */

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginationMeta {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface QueryParams {
    page?: number;
    size?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export type FilterType = "select" | "multiselect" | "date" | "daterange" | "toggle";

export interface SelectOption {
    label: string;
    value: string;
}

export interface FilterConfig {
    type: FilterType;
    label: string;
    placeholder?: string;
    value: string | string[];
    onChange: (value: string | string[]) => void;
    options?: SelectOption[];
    disabled?: boolean;
}

// ============================================================================
// TABLE TYPES
// ============================================================================

export interface ColumnDef<T> {
    id: string;
    header: string;
    accessorKey?: keyof T;
    cell?: (row: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
    align?: "left" | "center" | "right";
    sticky?: "left" | "right";
}

export interface TableConfig<T> {
    columns: ColumnDef<T>[];
    data: T[];
    selectable?: boolean;
    onSelectionChange?: (selectedIds: Set<string>) => void;
    onRowClick?: (row: T) => void;
    emptyMessage?: string;
}

// ============================================================================
// DIALOG/FORM TYPES
// ============================================================================

export interface DialogState {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

export interface EntityFormConfig<TData> {
    onSubmit: (data: TData) => Promise<void>;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

// ============================================================================
// ACTION BUTTON TYPES
// ============================================================================

export type ActionVariant = "edit" | "delete" | "view" | "add" | "download" | "upload";

export interface ActionConfig {
    variant: ActionVariant;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
    tooltip?: string;
}

// ============================================================================
// BADGE TYPES
// ============================================================================

export type StatusVariant = "active" | "inactive" | "pending" | "error" | "success" | "warning" | "default";

export interface BadgeConfig {
    variant: StatusVariant;
    label: string;
    showDot?: boolean;
}
