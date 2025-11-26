"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { cn } from "@/lib/util/utils";

interface DebouncedInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value: string;
    onChange: (value: string) => void;
    debounceMs?: number;
    showClearButton?: boolean;
}

export function DebouncedInput({
    value: initialValue,
    onChange,
    debounceMs = 500,
    showClearButton = false,
    className,
    ...props
}: DebouncedInputProps) {
    const [value, setValue] = React.useState(initialValue);

    // Update local state when prop changes (e.g., clear button)
    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    // Debounce the onChange callback
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounceMs);

        return () => clearTimeout(timeout);
    }, [value, debounceMs, onChange]);

    const handleClear = () => {
        setValue("");
        onChange("");
    };

    if (!showClearButton) {
        return (
            <Input
                {...props}
                className={className}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        );
    }

    return (
        <div className="relative">
            <Input
                {...props}
                className={cn("pr-8", className)}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Clear search"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
}
