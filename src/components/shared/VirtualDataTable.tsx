"use client";

import { useRef, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@/lib/types/entity";

interface VirtualDataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    selectable?: boolean;
    selectedIds?: Set<string>;
    onSelectionChange?: (selectedIds: Set<string>) => void;
    estimatedItemSize?: number;
    containerHeight?: string;
}

/**
 * Virtual Data Table Component
 * Renders large datasets efficiently using virtual scrolling
 */
export function VirtualDataTable<T extends { id: string }>({
    data,
    columns,
    selectable = false,
    selectedIds = new Set<string>(),
    onSelectionChange,
    estimatedItemSize = 60,
    containerHeight = "600px",
}: VirtualDataTableProps<T>) {
    const parentRef = useRef<HTMLDivElement>(null);

    // Setup virtualizer
    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => estimatedItemSize,
        overscan: 10, // Render 10 additional items above/below viewport
    });

    const virtualRows = rowVirtualizer.getVirtualItems();
    const totalSize = rowVirtualizer.getTotalSize();

    // Selection handlers
    const isAllSelected = useMemo(() => {
        return data.length > 0 && data.every((item) => selectedIds.has(item.id));
    }, [data, selectedIds]);

    const isSomeSelected = useMemo(() => {
        return !isAllSelected && data.some((item) => selectedIds.has(item.id));
    }, [data, selectedIds, isAllSelected]);

    const handleSelectAll = () => {
        if (isAllSelected) {
            onSelectionChange?.(new Set());
        } else {
            onSelectionChange?.(new Set(data.map((item) => item.id)));
        }
    };

    const handleSelectRow = (id: string) => {
        const newSelection = new Set(selectedIds);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        onSelectionChange?.(newSelection);
    };

    // Calculate column styles
    const getColumnWidth = (col: ColumnDef<T>) => {
        if (col.sticky === "right") return "100px";
        if (col.id === "selection") return "50px";
        return col.width || "auto";
    };

    return (
        <div
            ref={parentRef}
            style={{ height: containerHeight }}
            className="border rounded-lg overflow-auto relative"
        >
            <Table>
                {/* Fixed Header */}
                <TableHeader className="sticky top-0 bg-background z-10 border-b shadow-sm">
                    <TableRow>
                        {selectable && (
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={isAllSelected || isSomeSelected}
                                    onCheckedChange={handleSelectAll}
                                    aria-label="Select all"
                                />
                            </TableHead>
                        )}
                        {columns.map((column) => (
                            <TableHead
                                key={column.id}
                                style={{ width: getColumnWidth(column) }}
                                className={
                                    column.align === "center"
                                        ? "text-center"
                                        : column.align === "right"
                                            ? "text-right"
                                            : ""
                                }
                            >
                                {typeof column.header === "function"
                                    ? null // Skip function headers for now
                                    : column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                {/* Virtual Body */}
                <TableBody>
                    {/* Spacer for virtualization */}
                    {virtualRows.length > 0 && (
                        <tr>
                            <td
                                colSpan={columns.length + (selectable ? 1 : 0)}
                                style={{
                                    height: `${virtualRows[0].start}px`,
                                    padding: 0,
                                    border: 0,
                                }}
                            />
                        </tr>
                    )}

                    {/* Virtual Rows */}
                    {virtualRows.map((virtualRow) => {
                        const row = data[virtualRow.index];
                        const isSelected = selectedIds.has(row.id);

                        return (
                            <TableRow
                                key={row.id}
                                data-state={isSelected ? "selected" : undefined}
                                className={isSelected ? "bg-muted/50" : ""}
                            >
                                {selectable && (
                                    <TableCell>
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => handleSelectRow(row.id)}
                                            aria-label={`Select row ${row.id}`}
                                        />
                                    </TableCell>
                                )}
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        className={
                                            column.align === "center"
                                                ? "text-center"
                                                : column.align === "right"
                                                    ? "text-right"
                                                    : ""
                                        }
                                    >
                                        {column.cell ? column.cell(row) : (row as any)[column.id!]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        );
                    })}

                    {/* Bottom Spacer */}
                    {virtualRows.length > 0 && (
                        <tr>
                            <td
                                colSpan={columns.length + (selectable ? 1 : 0)}
                                style={{
                                    height: `${totalSize -
                                        (virtualRows[virtualRows.length - 1]?.end || 0)
                                        }px`,
                                    padding: 0,
                                    border: 0,
                                }}
                            />
                        </tr>
                    )}
                </TableBody>
            </Table>

            {/* Empty State */}
            {data.length === 0 && (
                <div className="flex items-center justify-center h-32 text-center text-muted-foreground">
                    <div>
                        <p className="text-sm font-medium">No data available</p>
                        <p className="text-xs">Try adjusting your filters</p>
                    </div>
                </div>
            )}
        </div>
    );
}
