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
import { MoreVertical, Pencil, Trash, Trash2, RotateCcw, Key } from "lucide-react";

/**
 * User entity type
 */
export interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    active: boolean;
    role?: string;
    vehiclesIds?: string[];
    vehicles?: any[];
    vehicleCreditLimit?: number;
    createdAt: string;
    createdBy: string;
    lastLogin: string | null;
}

/**
 * Column definition factory for Users table
 * Returns columns with action handlers injected
 */
export function createUserColumns(handlers: {
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onRestore?: (user: User) => void;
    onHardDelete?: (user: User) => void;
    onResetPassword?: (user: User) => void;
}): ColumnDef<User>[] {
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
            id: "username",
            header: "Username",
            cell: (row) => <span className="font-medium text-foreground">{row.username}</span>,
            sortable: true,
        },
        {
            id: "name",
            header: "Name",
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                        {row.firstName} {row.lastName}
                    </span>
                    <span className="text-sm text-muted-foreground">{row.email}</span>
                </div>
            ),
            sortable: true,
        },
        {
            id: "mobile",
            header: "Mobile",
            cell: (row) => (
                <span className="text-sm text-foreground">{row.phoneNumber || "-"}</span>
            ),
        },
        {
            id: "role",
            header: "Role",
            cell: (row) => (
                <span className="capitalize text-sm font-medium text-accent-foreground">
                    {row.role || "No Role"}
                </span>
            ),
            align: "center",
        },
        {
            id: "createdBy",
            header: "Created By",
            cell: (row) => (
                <span className="text-sm text-muted-foreground">{row.createdBy || "-"}</span>
            ),
            align: "center",
        },
        {
            id: "vehicles",
            header: "Vehicles",
            cell: (row) => (
                <span className="text-sm text-muted-foreground">
                    {row.vehicles?.length || row.vehiclesIds?.length || 0}
                </span>
            ),
            align: "center",
        },
        {
            id: "credit",
            header: "Credit",
            cell: (row) => (
                <span className="text-sm text-muted-foreground">{row.vehicleCreditLimit}</span>
            ),
            align: "center",
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
            id: "lastLogin",
            header: "Last Login",
            cell: (row) => (
                <span className="text-sm text-muted-foreground">
                    {row.lastLogin
                        ? new Date(row.lastLogin).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                        })
                        : "Never"}
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

                        {handlers.onResetPassword && (
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlers.onResetPassword?.(row);
                                }}
                                className="cursor-pointer"
                            >
                                <Key className="mr-2 h-4 w-4" />
                                Reset Password
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
