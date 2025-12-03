/**
 * Export utilities for entity data
 * Supports CSV, JSON, and Excel formats
 */

/**
 * Convert data to CSV format
 */
export function convertToCSV<T extends Record<string, any>>(
    data: T[],
    columns?: string[]
): string {
    if (data.length === 0) return "";

    // Get headers
    const headers = columns || Object.keys(data[0]);
    const csvHeaders = headers.join(",");

    // Get rows
    const csvRows = data.map((row) => {
        return headers
            .map((header) => {
                let value = row[header];

                // Handle null/undefined
                if (value == null) return "";

                // Handle objects/arrays
                if (typeof value === "object") {
                    value = JSON.stringify(value);
                }

                // Escape quotes and wrap in quotes if contains comma/newline
                value = String(value).replace(/"/g, '""');
                if (value.includes(",") || value.includes("\n") || value.includes('"')) {
                    value = `"${value}"`;
                }

                return value;
            })
            .join(",");
    });

    return [csvHeaders, ...csvRows].join("\n");
}

/**
 * Download data as CSV file
 */
export function exportToCSV<T extends Record<string, any>>(
    data: T[],
    filename: string,
    columns?: string[]
): void {
    const csv = convertToCSV(data, columns);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, `${filename}.csv`);
}

/**
 * Download data as JSON file
 */
export function exportToJSON<T>(data: T[], filename: string): void {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
    downloadBlob(blob, `${filename}.json`);
}

/**
 * Download data as Excel file (basic format)
 * For advanced Excel features, consider using the 'xlsx' library
 */
export function exportToExcel<T extends Record<string, any>>(
    data: T[],
    filename: string,
    columns?: string[]
): void {
    // For now, export as CSV with .xls extension
    // Excel can open CSV files, and this avoids adding the xlsx dependency
    const csv = convertToCSV(data, columns);
    const blob = new Blob([csv], { type: "application/vnd.ms-excel;charset=utf-8;" });
    downloadBlob(blob, `${filename}.xls`);
}

/**
 * Helper function to download a blob
 */
function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Format entity data for export (remove complex nested objects)
 */
export function prepareDataForExport<T extends Record<string, any>>(
    data: T[],
    options?: {
        excludeFields?: string[];
        includeFields?: string[];
        flattenObjects?: boolean;
    }
): Record<string, any>[] {
    const { excludeFields = [], includeFields, flattenObjects = true } = options || {};

    return data.map((item) => {
        const exportItem: Record<string, any> = {};

        Object.entries(item).forEach(([key, value]) => {
            // Skip excluded fields
            if (excludeFields.includes(key)) return;

            // Only include specified fields if provided
            if (includeFields && !includeFields.includes(key)) return;

            // Handle nested objects
            if (flattenObjects && typeof value === "object" && value !== null && !Array.isArray(value)) {
                // Flatten object (e.g., { user: { name: 'John' } } -> { userName: 'John' })
                Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                    if (typeof nestedValue !== "object") {
                        exportItem[`${key}_${nestedKey}`] = nestedValue;
                    }
                });
            } else if (Array.isArray(value)) {
                // Convert arrays to comma-separated strings
                exportItem[key] = value.map(v => typeof v === "object" ? JSON.stringify(v) : v).join(", ");
            } else {
                exportItem[key] = value;
            }
        });

        return exportItem;
    });
}
