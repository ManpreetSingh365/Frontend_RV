import { useState, useCallback, useMemo } from "react";

/**
 * Sort direction type
 */
export type SortDirection = "asc" | "desc" | null;

/**
 * Sort configuration
 */
export interface SortConfig {
    column: string | null;
    direction: SortDirection;
}

/**
 * Hook for managing entity sorting
 * 
 * @example
 * ```tsx
 * const { sortConfig, handleSort, sortedData } = useEntitySort({
 *   data: users,
 *   initialSort: { column: 'createdAt', direction: 'desc' }
 * });
 * ```
 */
export function useEntitySort<T extends Record<string, any>>({
    data,
    initialSort,
}: {
    data: T[];
    initialSort?: SortConfig;
}) {
    const [sortConfig, setSortConfig] = useState<SortConfig>(
        initialSort || { column: null, direction: null }
    );

    /**
     * Handle sort column change
     */
    const handleSort = useCallback((column: string) => {
        setSortConfig((prev) => {
            // If clicking the same column, cycle through: asc -> desc -> null
            if (prev.column === column) {
                if (prev.direction === "asc") {
                    return { column, direction: "desc" };
                } else if (prev.direction === "desc") {
                    return { column: null, direction: null };
                }
            }
            // New column, start with ascending
            return { column, direction: "asc" };
        });
    }, []);

    /**
     * Reset sort to initial state
     */
    const resetSort = useCallback(() => {
        setSortConfig(initialSort || { column: null, direction: null });
    }, [initialSort]);

    /**
     * Sorted data (client-side sorting)
     */
    const sortedData = useMemo(() => {
        if (!sortConfig.column || !sortConfig.direction) {
            return data;
        }

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.column!];
            const bValue = b[sortConfig.column!];

            // Handle null/undefined
            if (aValue == null) return 1;
            if (bValue == null) return -1;

            // Handle different types
            if (typeof aValue === "string" && typeof bValue === "string") {
                const comparison = aValue.localeCompare(bValue);
                return sortConfig.direction === "asc" ? comparison : -comparison;
            }

            if (typeof aValue === "number" && typeof bValue === "number") {
                return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
            }

            // Handle dates
            if (aValue instanceof Date && bValue instanceof Date) {
                const comparison = aValue.getTime() - bValue.getTime();
                return sortConfig.direction === "asc" ? comparison : -comparison;
            }

            // Try to convert to string for comparison
            const aStr = String(aValue);
            const bStr = String(bValue);
            const comparison = aStr.localeCompare(bStr);
            return sortConfig.direction === "asc" ? comparison : -comparison;
        });
    }, [data, sortConfig]);

    return {
        sortConfig,
        handleSort,
        resetSort,
        sortedData,
    };
}
