"use client";

import { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/util/utils";
import type { ColumnDef } from "@/lib/types/entity";

interface DataTableProps<T extends { id: string }> {
    columns: ColumnDef<T>[];
    data: T[];
    selectable?: boolean;
    onSelectionChange?: (selectedIds: Set<string>) => void;
    onRowClick?: (row: T) => void;
    emptyMessage?: string;
}

/**
 * Universal Data Table Component
 * Generic table with selection, sorting, and responsive design
 * 
 * @example
 * const columns: ColumnDef<User>[] = [
 *   { id: 'name', header: 'Name', accessorKey: 'firstName' },
 *   { id: 'email', header: 'Email', cell: (row) => row.email }
 * ];
 * 
 * <DataTable
 *   columns={columns}
 *   data={users}
 *   selectable
 *   onSelectionChange={setSelected}
 * />
 */
export function DataTable<T extends { id: string }>({
    columns,
    data,
    selectable = false,
    onSelectionChange,
    onRowClick,
    emptyMessage = "No data available",
}: DataTableProps<T>) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const isAllSelected = useMemo(
        () => data.length > 0 && selectedIds.size === data.length,
        [data.length, selectedIds.size]
    );

    const toggleSelectAll = () => {
        const newSelection = isAllSelected ? new Set<string>() : new Set(data.map((row) => row.id));
        setSelectedIds(newSelection);
        onSelectionChange?.(newSelection);
    };

    const toggleSelectRow = (id: string) => {
        const newSelection = new Set(selectedIds);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedIds(newSelection);
        onSelectionChange?.(newSelection);
    };

    return (
        <div className="w-full mb-4 sm:mb-6">
            <div className="overflow-x-auto sm:overflow-hidden -mx-4 sm:mx-0 px-4 sm:px-0">
                <div className="min-w-full sm:min-w-0 inline-block sm:block">
                    <div className="border-y sm:border-x sm:rounded-xl bg-background">
                        <Table className="min-w-full sm:w-full">
                            <TableHeader>
                                <TableRow>
                                    {selectable && (
                                        <TableHead className="w-12 sm:w-[3%] pl-4 sm:pl-6 sticky left-0 sm:static z-[1] sm:z-auto bg-background">
                                            <Checkbox
                                                checked={isAllSelected}
                                                onCheckedChange={toggleSelectAll}
                                                aria-label="Select all"
                                            />
                                        </TableHead>
                                    )}
                                    {columns.map((column) => (
                                        <TableHead
                                            key={column.id}
                                            className={cn(
                                                "text-xs sm:text-sm",
                                                column.width && `w-[${column.width}]`,
                                                column.align === "center" && "text-center",
                                                column.align === "right" && "text-right",
                                                column.sticky === "left" &&
                                                "sticky left-0 z-[1] bg-background",
                                                column.sticky === "right" &&
                                                "sticky right-0 z-[1] bg-background"
                                            )}
                                        >
                                            {column.header}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length + (selectable ? 1 : 0)}
                                            className="text-center py-12 text-muted-foreground"
                                        >
                                            {emptyMessage}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            onClick={() => onRowClick?.(row)}
                                            className={cn(onRowClick && "cursor-pointer")}
                                        >
                                            {selectable && (
                                                <TableCell className="pl-4 sm:pl-6 sticky left-0 sm:static z-[1] sm:z-auto bg-background py-3 sm:py-4">
                                                    <Checkbox
                                                        checked={selectedIds.has(row.id)}
                                                        onCheckedChange={() => toggleSelectRow(row.id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        aria-label={`Select row ${row.id}`}
                                                    />
                                                </TableCell>
                                            )}
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    className={cn(
                                                        "py-3 sm:py-4",
                                                        column.align === "center" && "text-center",
                                                        column.align === "right" && "text-right",
                                                        column.sticky === "left" &&
                                                        "sticky left-0 z-[1] bg-background",
                                                        column.sticky === "right" &&
                                                        "sticky right-0 z-[1] bg-background"
                                                    )}
                                                >
                                                    {column.cell
                                                        ? column.cell(row)
                                                        : column.accessorKey
                                                            ? String(row[column.accessorKey])
                                                            : null}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}
