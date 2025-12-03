// Export all shared hooks for easy importing
export { useDialogState } from "./use-dialog-state";
export { useEntityForm } from "./use-entity-form";
export { usePagination } from "./use-pagination";
export { useDebounce } from "./use-debounce";
export { useSelectOptions } from "./use-select-options";

// Export generic entity management hooks
export { useEntityList } from "./use-entity-list";
export { useEntityCRUD } from "./use-entity-crud";
export { useEntitySort } from "./use-entity-sort";
export type { SortConfig, SortDirection } from "./use-entity-sort";

// Export advanced feature hooks
export { useColumnCustomization } from "./use-column-customization";
export { useAdvancedFilters } from "./use-advanced-filters";

// Re-export existing query hooks
export {
    useRolesQuery,
    useRolesPaginatedQuery,
    useVehiclesQuery,
    useAddressTypesQuery,
    usePermissionsQuery,
    useUsersQuery,
    QUERY_KEYS,
} from "./use-queries";
