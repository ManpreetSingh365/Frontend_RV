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

// Export generic entity components
export { EntityList } from "./EntityList";
export { EntityCRUDDialogs } from "./EntityCRUDDialogs";
export { SortableHeader } from "./SortableHeader";
export { ExportButton } from "./ExportButton";

// Export advanced features
export { ColumnCustomizer } from "./ColumnCustomizer";
export { AdvancedFilterDialog } from "./AdvancedFilterDialog";
export { VirtualDataTable } from "./VirtualDataTable";

// Re-export types
export type {
    StatusVariant,
    ActionVariant,
    ColumnDef,
    FilterConfig,
    SelectOption,
} from "@/lib/types/entity";
