import { useState } from "react";
import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToCSV, exportToJSON, exportToExcel, prepareDataForExport } from "@/lib/utils/export-utils";

interface ExportButtonProps<T> {
    data: T[];
    filename: string;
    selectedIds?: Set<string>;
    disabled?: boolean;
}

/**
 * Export button with dropdown menu for different formats
 * Supports CSV, JSON, and Excel export
 */
export function ExportButton<T extends { id: string }>({
    data,
    filename,
    selectedIds,
    disabled = false,
}: ExportButtonProps<T>) {
    const [isExporting, setIsExporting] = useState(false);

    const getExportData = () => {
        // If there are selected items, export only those
        if (selectedIds && selectedIds.size > 0) {
            return data.filter(item => selectedIds.has(item.id));
        }
        return data;
    };

    const handleExport = async (format: "csv" | "json" | "excel") => {
        setIsExporting(true);
        try {
            const exportData = getExportData();
            const prepared = prepareDataForExport(exportData, {
                excludeFields: ["password", "credentials"],
                flattenObjects: true,
            });

            const timestamp = new Date().toISOString().split('T')[0];
            const finalFilename = `${filename}_${timestamp}`;

            switch (format) {
                case "csv":
                    exportToCSV(prepared, finalFilename);
                    break;
                case "json":
                    exportToJSON(prepared, finalFilename);
                    break;
                case "excel":
                    exportToExcel(prepared, finalFilename);
                    break;
            }
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setIsExporting(false);
        }
    };

    const exportCount = selectedIds && selectedIds.size > 0
        ? `${selectedIds.size} selected`
        : `${data.length} items`;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={disabled || isExporting || data.length === 0}
                >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Export {exportCount}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                    <FileText className="mr-2 h-4 w-4" />
                    CSV File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("json")}>
                    <FileJson className="mr-2 h-4 w-4" />
                    JSON File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("excel")}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Excel File
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
