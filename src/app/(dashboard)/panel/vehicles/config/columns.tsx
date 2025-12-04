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

/**
 * Vehicle entity type
 */
export interface Vehicle {
    id: string;
    licensePlate: string;
    brand: string;
    model: string;
    year: number;
    vin: string;
    vehicleOwner: string;
    emergencyNumber: string;
    vehicleType: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    deviceId: string | null;
    userIds: string[];
}

/**
 * Column definition factory for Vehicles table
 */
export function createVehicleColumns(handlers: {
    onEdit: (vehicle: Vehicle) => void;
    onDelete: (vehicle: Vehicle) => void;
    onRestore?: (vehicle: Vehicle) => void;
    onHardDelete?: (vehicle: Vehicle) => void;
}): ColumnDef<Vehicle>[] {
    return [
        {
            id: "status",
            header: "Status",
            cell: (row) => (
                <Badge variant={row.status === "REGISTERED" ? "active" : "inactive"} showDot>
                    {row.status}
                </Badge>
            ),
            align: "center",
        },
        {
            id: "licensePlate",
            header: "License Plate",
            cell: (row) => <span className="font-medium text-foreground font-mono">{row.licensePlate}</span>,
            sortable: true,
        },
        {
            id: "brand",
            header: "Brand",
            cell: (row) => <span className="text-sm text-foreground">{row.brand}</span>,
        },
        {
            id: "model",
            header: "Model",
            cell: (row) => <span className="text-sm text-foreground">{row.model}</span>,
        },
        {
            id: "year",
            header: "Year",
            cell: (row) => <span className="text-sm text-muted-foreground">{row.year}</span>,
            align: "center",
        },
        {
            id: "vehicleType",
            header: "Type",
            cell: (row) => (
                <Badge variant="default" className="text-xs">
                    {row.vehicleType}
                </Badge>
            ),
            align: "center",
        },
        {
            id: "vehicleOwner",
            header: "Owner",
            cell: (row) => <span className="text-sm text-foreground">{row.vehicleOwner}</span>,
        },
        {
            id: "emergencyNumber",
            header: "Emergency",
            cell: (row) => <span className="text-sm font-mono text-muted-foreground">{row.emergencyNumber}</span>,
        },
        {
            id: "device",
            header: "Device",
            cell: (row) => (
                <span className="text-sm text-muted-foreground">
                    {row.deviceId ? "Connected" : "No Device"}
                </span>
            ),
            align: "center",
        },
        {
            id: "users",
            header: "Users",
            cell: (row) => (
                <span className="text-sm text-muted-foreground">
                    {row.userIds?.length || 0}
                </span>
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

                        {row.status !== "REGISTERED" && handlers.onRestore && (
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
