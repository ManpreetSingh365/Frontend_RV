// Export all shared components for easy importing
export { Badge } from "./Badge";
export { ConfirmDialog } from "./ConfirmDialog";
export { SearchInput } from "./SearchInput";
export { ActionButton } from "./ActionButton";
export { FilterBar } from "./FilterBar";
export { TableToolbar } from "./TableToolbar";
export { DataTable } from "./DataTable";
export { PageHeader } from "./PageHeader";
export { EntityFilters } from "./EntityFilters";

// Re-export types
export type {
    StatusVariant,
    ActionVariant,
    ColumnDef,
    FilterConfig,
    SelectOption,
} from "@/lib/types/entity";
