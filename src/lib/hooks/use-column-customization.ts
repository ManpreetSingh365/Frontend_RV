import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type { ColumnDef } from "@/lib/types/entity";

interface ColumnCustomizationState {
    visibleColumnIds: Set<string>;
    columnOrder: string[];
}

interface UseColumnCustomizationOptions {
    entityName: string;
    columns: ColumnDef<any>[];
    defaultVisible?: string[]; // Default visible column IDs
}

/**
 * Hook for managing column visibility and order
 * Persists state to localStorage for user preferences
 */
export function useColumnCustomization({
    entityName,
    columns,
    defaultVisible,
}: UseColumnCustomizationOptions) {
    const storageKey = `column-customization-${entityName}`;
    const isInitialMount = useRef(true);

    // Initialize default state
    const defaultState = useMemo(() => {
        const allColumnIds = columns.map((col) => col.id).filter(Boolean) as string[];
        return {
            visibleColumnIds: new Set(defaultVisible || allColumnIds),
            columnOrder: allColumnIds,
        };
    }, [columns, defaultVisible]);

    const [state, setState] = useState<ColumnCustomizationState>(() => {
        // Initialize from localStorage if available
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem(storageKey);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    return {
                        visibleColumnIds: new Set(parsed.visibleColumnIds || []),
                        columnOrder: parsed.columnOrder || defaultState.columnOrder,
                    };
                }
            } catch (error) {
                console.error("Failed to load column customization:", error);
            }
        }
        return defaultState;
    });

    // Save to localStorage whenever state changes (but not on initial mount)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        try {
            localStorage.setItem(
                storageKey,
                JSON.stringify({
                    visibleColumnIds: Array.from(state.visibleColumnIds),
                    columnOrder: state.columnOrder,
                })
            );
        } catch (error) {
            console.error("Failed to save column customization:", error);
        }
    }, [state, storageKey]);

    // Toggle column visibility
    const toggleColumn = useCallback((columnId: string) => {
        setState((prev) => {
            const newVisible = new Set(prev.visibleColumnIds);
            if (newVisible.has(columnId)) {
                newVisible.delete(columnId);
            } else {
                newVisible.add(columnId);
            }
            return {
                ...prev,
                visibleColumnIds: newVisible,
            };
        });
    }, []);

    // Set column visibility
    const setColumnVisibility = useCallback((columnId: string, visible: boolean) => {
        setState((prev) => {
            const newVisible = new Set(prev.visibleColumnIds);
            if (visible) {
                newVisible.add(columnId);
            } else {
                newVisible.delete(columnId);
            }
            return {
                ...prev,
                visibleColumnIds: newVisible,
            };
        });
    }, []);

    // Reorder columns
    const reorderColumns = useCallback((newOrder: string[]) => {
        setState((prev) => ({
            ...prev,
            columnOrder: newOrder,
        }));
    }, []);

    // Reset to defaults
    const resetColumns = useCallback(() => {
        setState(defaultState);
        try {
            localStorage.removeItem(storageKey);
        } catch (error) {
            console.error("Failed to reset column customization:", error);
        }
    }, [defaultState, storageKey]);

    // Get visible columns in correct order
    const visibleColumns = useMemo(() => {
        // System columns that should always be visible
        const systemColumns = ["selection", "actions"];

        // Create a map for quick lookup
        const columnMap = new Map(columns.map((col) => [col.id, col]));

        // Get customizable columns (non-system columns)
        const customizableColumnIds = state.columnOrder.filter(
            (id) => !systemColumns.includes(id)
        );

        // Build final column list:
        // 1. Selection column (if exists) - always first
        // 2. Customizable columns (based on visibility)
        // 3. Actions column (if exists) - always last
        const result: ColumnDef<any>[] = [];

        // Add selection column if it exists
        const selectionCol = columnMap.get("selection");
        if (selectionCol) {
            result.push(selectionCol);
        }

        // Add visible customizable columns
        customizableColumnIds
            .filter((id) => state.visibleColumnIds.has(id))
            .forEach((id) => {
                const col = columnMap.get(id);
                if (col) result.push(col);
            });

        // Add actions column if it exists
        const actionsCol = columnMap.get("actions");
        if (actionsCol) {
            result.push(actionsCol);
        }

        return result;
    }, [columns, state.visibleColumnIds, state.columnOrder]);

    // Check if column is visible
    const isColumnVisible = useCallback(
        (columnId: string) => state.visibleColumnIds.has(columnId),
        [state.visibleColumnIds]
    );

    return {
        visibleColumns,
        visibleColumnIds: state.visibleColumnIds,
        columnOrder: state.columnOrder,
        toggleColumn,
        setColumnVisibility,
        reorderColumns,
        resetColumns,
        isColumnVisible,
        hasCustomization: state.visibleColumnIds.size !== columns.length,
    };
}
