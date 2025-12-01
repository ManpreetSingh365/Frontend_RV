import type { ComboboxOption } from "@/components/ui/searchable-combobox";

export interface TransformConfig<T> {
    getValue: (item: T) => string;
    getLabel: (item: T) => string;
    getDescription?: (item: T) => string;
}

export function createEntityTransformer<T>(config: TransformConfig<T>) {
    return function transformToOptions(items: T[]): ComboboxOption[] {
        return items.map((item) => ({
            value: config.getValue(item),
            label: config.getLabel(item),
            description: config.getDescription?.(item),
        }));
    };
}

// Generic simple transformer for basic entities
export function transformToComboboxOptions<T extends { id: string; name: string }>(
    items: T[]
): ComboboxOption[] {
    return items.map((item) => ({
        value: item.id,
        label: item.name,
    }));
}
