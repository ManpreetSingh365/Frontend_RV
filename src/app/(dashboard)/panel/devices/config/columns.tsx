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
 * Device entity type
 */
export interface Device {
    id: string;
    imei: string;
    deviceModel: string;
    firmwareVersion: string;
    simNumber: string;
    status: string;
    protocolType: string;
    simCategory: string;
    lastHeartbeat: string | null;
    expiryAt: string;
    createdAt: string;
    createdBy: string;
    vehicleId: string | null;
}

/**
 * Column definition factory for Devices table
 */
export function createDeviceColumns(handlers: {
    onEdit: (device: Device) => void;
    onDelete: (device: Device) => void;
    onRestore?: (device: Device) => void;
    onHardDelete?: (device: Device) => void;
}): ColumnDef<Device>[] {
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
            id: "imei",
            header: "IMEI",
            cell: (row) => <span className="font-medium text-foreground font-mono">{row.imei}</span>,
            sortable: true,
        },
        {
            id: "deviceModel",
            header: "Model",
            cell: (row) => <span className="text-sm text-foreground">{row.deviceModel}</span>,
            align: "center",
        },
        {
            id: "firmware",
            header: "Firmware",
            cell: (row) => <span className="text-sm text-muted-foreground">{row.firmwareVersion}</span>,
            align: "center",
        },
        {
            id: "simNumber",
            header: "SIM Number",
            cell: (row) => <span className="text-sm font-mono text-foreground">{row.simNumber}</span>,
        },
        {
            id: "simCategory",
            header: "SIM Provider",
            cell: (row) => (
                <Badge variant="default" className="text-xs">
                    {row.simCategory}
                </Badge>
            ),
            align: "center",
        },
        {
            id: "protocolType",
            header: "Protocol",
            cell: (row) => <span className="text-sm text-muted-foreground">{row.protocolType}</span>,
            align: "center",
        },
        {
            id: "vehicleId",
            header: "Vehicle",
            cell: (row) => (
                <span className="text-sm text-muted-foreground">
                    {row.vehicleId ? "Assigned" : "Unassigned"}
                </span>
            ),
            align: "center",
        },
        {
            id: "expiryAt",
            header: "Expires",
            cell: (row) => (
                <span className="text-sm text-muted-foreground">
                    {new Date(row.expiryAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    })}
                </span>
            ),
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
