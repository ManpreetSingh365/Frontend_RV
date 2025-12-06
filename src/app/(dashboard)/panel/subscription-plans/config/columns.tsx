import { ColumnDef } from "@/lib/types/entity";
import { Badge } from "@/components/shared";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash, Trash2, RotateCcw, IndianRupee } from "lucide-react";

/**
 * Subscription Plan entity type
 */
export interface SubscriptionPlan {
    id: string;
    name: string;
    amount: number;
    durationDays: number;
    features: string[];
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Column definition factory for Subscription Plans table
 * Returns columns with action handlers injected
 */
export function createSubscriptionPlanColumns(handlers: {
    onEdit: (plan: SubscriptionPlan) => void;
    onDelete: (plan: SubscriptionPlan) => void;
    onRestore?: (plan: SubscriptionPlan) => void;
    onHardDelete?: (plan: SubscriptionPlan) => void;
}): ColumnDef<SubscriptionPlan>[] {
    return [
        {
            id: "status",
            header: "Status",
            cell: (row) => (
                <Badge variant={row.active !== false ? "active" : "inactive"} showDot>
                    {row.active !== false ? "Active" : "Inactive"}
                </Badge>
            ),
            align: "center",
        },
        {
            id: "name",
            header: "Plan Name",
            cell: (row) => <span className="font-medium text-foreground">{row.name}</span>,
            sortable: true,
        },
        {
            id: "amount",
            header: "Amount",
            cell: (row) => (
                <span className="text-sm font-semibold text-foreground flex items-center justify-end gap-1">
                    <IndianRupee className="h-4 w-4" />
                    {row.amount.toLocaleString()}
                </span>
            ),
            align: "right",
            sortable: true,
        },
        {
            id: "duration",
            header: "Duration",
            cell: (row) => (
                <span className="text-sm text-muted-foreground">
                    {row.durationDays} days
                </span>
            ),
            align: "center",
        },
        {
            id: "features",
            header: "Features",
            cell: (row) => {
                const featureCount = row.features?.length || 0;
                const displayCount = Math.min(featureCount, 2);
                const remainingCount = Math.max(0, featureCount - displayCount);

                return (
                    <div className="flex items-center gap-1 flex-wrap">
                        {row.features?.slice(0, displayCount).map((feature, idx) => (
                            <Badge key={idx} variant="default" className="text-xs px-2 py-0.5">
                                {feature}
                            </Badge>
                        ))}
                        {remainingCount > 0 && (
                            <Badge variant="default" className="text-xs px-2 py-0.5">
                                +{remainingCount}
                            </Badge>
                        )}
                    </div>
                );
            },
        },
        {
            id: "createdAt",
            header: "Created",
            cell: (row) => (
                <span className="text-sm text-muted-foreground">
                    {new Date(row.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    })}
                </span>
            ),
        },
        {
            id: "updatedAt",
            header: "Updated",
            cell: (row) => (
                <span className="text-sm text-muted-foreground">
                    {new Date(row.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    })}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: (row) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                handlers.onEdit(row);
                            }}
                            className="cursor-pointer"
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>

                        {!row.active && handlers.onRestore && (
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlers.onRestore?.(row);
                                }}
                                className="cursor-pointer text-blue-600 focus:text-blue-600"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Restore
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                handlers.onDelete(row);
                            }}
                            className="cursor-pointer text-destructive focus:text-destructive"
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                        {handlers.onHardDelete && (
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlers.onHardDelete?.(row);
                                }}
                                className="cursor-pointer text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Permanently Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            align: "right",
            sticky: "right",
        },
    ];
}
