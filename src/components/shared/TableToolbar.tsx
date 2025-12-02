"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Download } from "lucide-react";

interface TableToolbarProps {
    selectedCount?: number;
    onBulkDelete?: () => void;
    onExport?: () => void;
    actions?: React.ReactNode;
}

/**
 * Table Toolbar Component
 * Displays bulk actions, export, and custom actions
 * 
 * @example
 * <TableToolbar
 *   selectedCount={selected.length}
 *   onBulkDelete={handleBulkDelete}
 *   onExport={handleExport}
 * />
 */
export function TableToolbar({
    selectedCount = 0,
    onBulkDelete,
    onExport,
    actions,
}: TableToolbarProps) {
    if (!selectedCount && !onExport && !actions) {
        return null;
    }

    return (
        <div className="flex items-center justify-between p-2 border rounded-lg bg-muted/50 mb-4">
            <div className="flex items-center gap-2">
                {selectedCount > 0 && (
                    <>
                        <span className="text-sm font-medium text-muted-foreground">
                            {selectedCount} selected
                        </span>
                        {onBulkDelete && (
                            <>
                                <Separator orientation="vertical" className="h-6" />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onBulkDelete}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Selected
                                </Button>
                            </>
                        )}
                    </>
                )}
            </div>

            <div className="flex items-center gap-2">
                {actions}
                {onExport && (
                    <Button variant="outline" size="sm" onClick={onExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                )}
            </div>
        </div>
    );
}
