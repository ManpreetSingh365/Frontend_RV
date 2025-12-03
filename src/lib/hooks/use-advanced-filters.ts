import { useState, useEffect, useCallback } from "react";
import type { FilterCondition } from "@/lib/utils/filter-utils";
import { applyAdvancedFilters } from "@/lib/utils/filter-utils";

interface FilterPreset {
    name: string;
    conditions: FilterCondition[];
    logic: "AND" | "OR";
}

interface UseAdvancedFiltersOptions {
    entityName: string;
    initialConditions?: FilterCondition[];
    initialLogic?: "AND" | "OR";
}

/**
 * Hook for managing advanced filters
 * Supports multiple conditions, AND/OR logic, and filter presets
 */
export function useAdvancedFilters({
    entityName,
    initialConditions = [],
    initialLogic = "AND",
}: UseAdvancedFiltersOptions) {
    const [conditions, setConditions] = useState<FilterCondition[]>(initialConditions);
    const [logic, setLogic] = useState<"AND" | "OR">(initialLogic);
    const [presets, setPresets] = useState<Record<string, FilterPreset>>({});

    const presetsStorageKey = `filter-presets-${entityName}`;

    // Load presets from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(presetsStorageKey);
            if (saved) {
                setPresets(JSON.parse(saved));
            }
        } catch (error) {
            console.error("Failed to load filter presets:", error);
        }
    }, [presetsStorageKey]);

    // Save presets to localStorage
    const savePresetsToStorage = useCallback(
        (newPresets: Record<string, FilterPreset>) => {
            try {
                localStorage.setItem(presetsStorageKey, JSON.stringify(newPresets));
            } catch (error) {
                console.error("Failed to save filter presets:", error);
            }
        },
        [presetsStorageKey]
    );

    // Add a new condition
    const addCondition = useCallback((condition: FilterCondition) => {
        setConditions((prev) => [...prev, condition]);
    }, []);

    // Update a condition
    const updateCondition = useCallback((id: string, updates: Partial<FilterCondition>) => {
        setConditions((prev) =>
            prev.map((cond) => (cond.id === id ? { ...cond, ...updates } : cond))
        );
    }, []);

    // Remove a condition
    const removeCondition = useCallback((id: string) => {
        setConditions((prev) => prev.filter((cond) => cond.id !== id));
    }, []);

    // Clear all conditions
    const clearConditions = useCallback(() => {
        setConditions([]);
    }, []);

    // Apply filters to data
    const filterData = useCallback(
        <T,>(data: T[]): T[] => {
            return applyAdvancedFilters(data, conditions, logic) as T[];
        },
        [conditions, logic]
    );

    // Save current filters as a preset
    const savePreset = useCallback(
        (name: string) => {
            const newPresets = {
                ...presets,
                [name]: {
                    name,
                    conditions: [...conditions],
                    logic,
                },
            };
            setPresets(newPresets);
            savePresetsToStorage(newPresets);
        },
        [conditions, logic, presets, savePresetsToStorage]
    );

    // Load a preset
    const loadPreset = useCallback((name: string) => {
        const preset = presets[name];
        if (preset) {
            setConditions(preset.conditions);
            setLogic(preset.logic);
        }
    }, [presets]);

    // Delete a preset
    const deletePreset = useCallback(
        (name: string) => {
            const newPresets = { ...presets };
            delete newPresets[name];
            setPresets(newPresets);
            savePresetsToStorage(newPresets);
        },
        [presets, savePresetsToStorage]
    );

    return {
        // State
        conditions,
        logic,
        presets: Object.values(presets),
        hasActiveFilters: conditions.length > 0,

        // Condition management
        addCondition,
        updateCondition,
        removeCondition,
        clearConditions,
        setConditions,
        setLogic,

        // Data filtering
        filterData,

        // Preset management
        savePreset,
        loadPreset,
        deletePreset,
    };
}
