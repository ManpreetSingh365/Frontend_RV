"use client";

import { Badge } from "@/components/ui/badge";
import { SearchableCombobox, type ComboboxOption } from "@/components/ui/searchable-combobox";
import { X } from "lucide-react";

interface MultiSelectFieldProps {
    value: string[];
    onChange: (value: string[]) => void;
    options: ComboboxOption[];
    loading?: boolean;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
}

export function MultiSelectField({
    value = [],
    onChange,
    options,
    loading = false,
    placeholder = "Select items...",
    searchPlaceholder = "Search...",
    emptyMessage = "No items found",
}: MultiSelectFieldProps) {
    const selectedItems = value;
    const availableOptions = options.filter((opt) => !selectedItems.includes(opt.value));

    const handleAdd = (itemId: string) => {
        onChange([...selectedItems, itemId]);
    };

    const handleRemove = (itemId: string) => (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(selectedItems.filter((id) => id !== itemId));
    };

    return (
        <div className="space-y-2">
            {selectedItems.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedItems.map((id) => {
                        const item = options.find((opt) => opt.value === id);
                        if (!item) return null;

                        return (
                            <Badge key={id} variant="secondary" className="gap-1 pr-1">
                                <span>{item.label}</span>
                                <button
                                    type="button"
                                    onClick={handleRemove(id)}
                                    className="ml-1 rounded-sm hover:bg-secondary-foreground/20"
                                    aria-label={`Remove ${item.label}`}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        );
                    })}
                </div>
            )}

            <SearchableCombobox
                value=""
                onChange={handleAdd}
                options={availableOptions}
                loading={loading}
                placeholder={placeholder}
                searchPlaceholder={searchPlaceholder}
                emptyMessage={selectedItems.length > 0 ? "All items selected" : emptyMessage}
            />
        </div>
    );
}
