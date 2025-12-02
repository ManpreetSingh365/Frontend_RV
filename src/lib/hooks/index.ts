// Export all shared hooks for easy importing
export { useDialogState } from "./use-dialog-state";
export { useEntityForm } from "./use-entity-form";
export { usePagination } from "./use-pagination";
export { useDebounce } from "./use-debounce";
export { useSelectOptions } from "./use-select-options";

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
