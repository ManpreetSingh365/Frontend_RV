"use client";

import { useState } from "react";
import { Settings2, Eye, EyeOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { ColumnDef } from "@/lib/types/entity";

interface ColumnCustomizerProps {
    columns: ColumnDef<any>[];
    visibleColumnIds: Set<string>;
    onToggleColumn: (columnId: string) => void;
    onReset: () => void;
    hasCustomization?: boolean;
}

/**
 * Column Customizer Component
 * Allows users to show/hide columns in the table
 */
export function ColumnCustomizer({
    columns,
    visibleColumnIds,
    onToggleColumn,
    onReset,
    hasCustomization = false,
}: ColumnCustomizerProps) {
    const [open, setOpen] = useState(false);

    // Filter out columns without IDs and system columns (like actions, selection)
    const customizableColumns = columns.filter(
        (col) => col.id && !["selection", "actions"].includes(col.id)
    );

    const visibleCount = customizableColumns.filter((col) =>
        visibleColumnIds.has(col.id!)
    ).length;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2"
                >
                    <Settings2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Columns</span>
                    {hasCustomization && (
                        <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium">
                            {visibleCount}/{customizableColumns.length}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4" align="end">
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold text-sm">Customize Columns</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                                Show or hide columns
                            </p>
                        </div>
                        {hasCustomization && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onReset}
                                className="h-8 px-2"
                            >
                                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                                Reset
                            </Button>
                        )}
                    </div>

                    <Separator />

                    {/* Column List */}
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {customizableColumns.map((column) => {
                            const isVisible = visibleColumnIds.has(column.id!);
                            const headerText =
                                typeof column.header === "string"
                                    ? column.header
                                    : column.id;

                            return (
                                <div
                                    key={column.id}
                                    className="flex items-center space-x-2 rounded-md px-2 py-1.5 hover:bg-accent transition-colors cursor-pointer"
                                    onClick={() => onToggleColumn(column.id!)}
                                >
                                    <Checkbox
                                        id={`column-${column.id}`}
                                        checked={isVisible}
                                        onCheckedChange={() => onToggleColumn(column.id!)}
                                        className="pointer-events-none"
                                    />
                                    <Label
                                        htmlFor={`column-${column.id}`}
                                        className="flex-1 text-sm font-normal cursor-pointer flex items-center gap-2"
                                    >
                                        {isVisible ? (
                                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                        ) : (
                                            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                                        )}
                                        <span className="capitalize">{headerText}</span>
                                    </Label>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <Separator />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                            {visibleCount} of {customizableColumns.length} visible
                        </span>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
