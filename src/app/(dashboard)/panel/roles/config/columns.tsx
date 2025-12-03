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
import { MoreVertical, Pencil, Trash, Trash2, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Role entity type
 */
export interface Role {
    id: string;
    name: string;
    description?: string;
    roleLevel?: number;
    permissions: any[];
    active?: boolean;
    createdAt: string;
    assignedUserCount?: number;
}

/**
 * Column definition factory for Roles table
 * Returns columns with action handlers injected
 */
export function createRoleColumns(handlers: {
    onEdit: (role: Role) => void;
    onDelete: (role: Role) => void;
    onRestore?: (role: Role) => void;
    onHardDelete?: (role: Role) => void;
}): ColumnDef<Role>[] {
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
            header: "Name",
            cell: (row) => (
                <span className="font-medium text-foreground capitalize">{row.name}</span>
            ),
            sortable: true,
        },
        {
            id: "description",
            header: "Description",
            cell: (row) => {
                const text = row.description || "-";
                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="text-sm text-muted-foreground line-clamp-1 max-w-[200px] cursor-help">
                                {text}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-sm">{text}</TooltipContent>
                    </Tooltip>
                );
            },
        },
        {
            id: "level",
            header: "Level",
            cell: (row) => (
                <span className="text-sm text-muted-foreground">{row.roleLevel || "-"}</span>
            ),
            align: "center",
        },
        {
            id: "users",
            header: "Users",
            cell: (row) => (
                <span className="text-sm text-muted-foreground">
                    {row.assignedUserCount || 0}
                </span>
            ),
            align: "center",
        },
        {
            id: "permissions",
            header: "Permissions",
            cell: (row) => {
                const permissionCount = row.permissions?.length || 0;
                const displayCount = Math.min(permissionCount, 2);
                const remainingCount = Math.max(0, permissionCount - displayCount);

                return (
                    <div className="flex items-center gap-1 flex-wrap">
                        {row.permissions?.slice(0, displayCount).map((perm: any, idx: number) => (
                            <Badge key={idx} variant="default" className="text-xs px-2 py-0.5">
                                {typeof perm === "string" ? perm : perm.name || perm.permission}
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
