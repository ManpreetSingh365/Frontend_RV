"use client";

import { SearchInput } from "./SearchInput";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { FilterConfig } from "@/lib/types/entity";

interface FilterBarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    filters?: FilterConfig[];
}

/**
 * Universal Filter Bar Component
 * Combines search input with dynamic filter fields
 * 
 * @example
 * <FilterBar
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   filters={[
 *     {
 *       type: 'select',
 *       label: 'Role',
 *       value: role,
 *       onChange: setRole,
 *       options: [{ label: 'All', value: 'all' }, ...roles]
 *     }
 *   ]}
 * />
 */
export function FilterBar({
    searchValue,
    onSearchChange,
    searchPlaceholder = "Search...",
    filters = [],
}: FilterBarProps) {
    return (
        <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4 mb-4 sm:mb-6">
            {/* Search Input */}
            <SearchInput
                value={searchValue}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
            />

            {/* Dynamic Filters */}
            {filters.length > 0 && (
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    {filters.map((filter, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial min-w-0"
                        >
                            {filter.label && (
                                <Label
                                    htmlFor={`filter-${index}`}
                                    className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap shrink-0 font-medium"
                                >
                                    {filter.label}:
                                </Label>
                            )}
                            {filter.type === "select" && (
                                <Select
                                    value={filter.value as string}
                                    onValueChange={(value) => filter.onChange(value)}
                                    disabled={filter.disabled}
                                >
                                    <SelectTrigger
                                        id={`filter-${index}`}
                                        className="h-9 sm:h-10 w-full sm:w-32 text-xs sm:text-sm shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <SelectValue placeholder={filter.placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filter.options?.map((option, optIndex) => (
                                            <SelectItem key={`${index}-${optIndex}-${option.value}`} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
