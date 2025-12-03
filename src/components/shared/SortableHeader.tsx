import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SortDirection } from "@/lib/hooks";

interface SortableHeaderProps {
    column: string;
    label: string;
    currentColumn: string | null;
    direction: SortDirection;
    onSort: (column: string) => void;
}

/**
 * Sortable column header component
 * Shows sort indicator and handles click to sort
 */
export function SortableHeader({
    column,
    label,
    currentColumn,
    direction,
    onSort,
}: SortableHeaderProps) {
    const isActive = currentColumn === column;

    return (
        <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
            onClick={() => onSort(column)}
        >
            <span>{label}</span>
            {isActive && direction === "asc" && (
                <ArrowUp className="ml-2 h-4 w-4" />
            )}
            {isActive && direction === "desc" && (
                <ArrowDown className="ml-2 h-4 w-4" />
            )}
            {!isActive && (
                <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
            )}
        </Button>
    );
}
