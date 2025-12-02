"use client";

import { DebouncedInput } from "@/components/ui/debounced-input";
import { Search } from "lucide-react";
import { cn } from "@/lib/util/utils";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
    className?: string;
}

/**
 * Search Input Component with Built-in Debounce
 * Wraps DebouncedInput with search icon and styling
 * 
 * @example
 * const [search, setSearch] = useState("");
 * <SearchInput value={search} onChange={setSearch} placeholder="Search..." />
 */
export function SearchInput({
    value,
    onChange,
    placeholder = "Search...",
    debounceMs = 500,
    className,
}: SearchInputProps) {
    return (
        <div className={cn("relative flex-1 w-full sm:max-w-md", className)}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            <DebouncedInput
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                debounceMs={debounceMs}
                showClearButton
                className="pl-10 h-9 sm:h-10 text-sm shadow-sm focus:shadow-md transition-shadow"
            />
        </div>
    );
}
