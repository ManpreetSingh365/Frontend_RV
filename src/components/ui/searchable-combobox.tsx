"use client";

import { useState, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/util/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface ComboboxOption {
    value: string;
    label: string;
    description?: string | React.ReactNode;
}

interface SearchableComboboxProps {
    value: string;
    onChange: (value: string) => void;
    options: ComboboxOption[];
    loading?: boolean;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    className?: string;
}

export function SearchableCombobox({
    value,
    onChange,
    options,
    loading = false,
    placeholder = "Select option",
    searchPlaceholder = "Search...",
    emptyMessage = "No results found",
    disabled = false,
    className,
}: SearchableComboboxProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredOptions = useMemo(() => {
        if (!search) return options;
        const query = search.toLowerCase();
        return options.filter(
            (option) =>
                option.label.toLowerCase().includes(query) ||
                (typeof option.description === 'string' && option.description.toLowerCase().includes(query))
        );
    }, [options, search]);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between",
                        !selectedOption && "text-muted-foreground",
                        className
                    )}
                    disabled={disabled || loading}
                >
                    {selectedOption
                        ? selectedOption.label
                        : loading
                            ? "Loading..."
                            : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <div className="p-2">
                    <Input
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-9"
                    />
                </div>
                <div className="max-h-[300px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                    {filteredOptions.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            {emptyMessage}
                        </div>
                    ) : (
                        filteredOptions.map((option) => (
                            <div
                                key={option.value}
                                className={cn(
                                    "relative flex cursor-pointer select-none items-center px-2 py-2 hover:bg-accent",
                                    value === option.value && "bg-accent"
                                )}
                                onClick={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                    setSearch("");
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                <div className="flex flex-col">
                                    <span className="font-semibold">{option.label}</span>
                                    {option.description && (
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            {option.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
