import { EntityConfig } from "@/lib/types/entity-config";
import { createDeviceColumns, Device } from "./columns";
import * as deviceService from "@/lib/service/device.service";
import { useDevicesQuery } from "@/lib/hooks";
import AddDeviceDialog from "../components/dialogs/AddDeviceDialog";
import UpdateDeviceDialog from "../components/dialogs/UpdateDeviceDialog";

/**
 * Complete entity configuration for Devices
 */
export function createDevicesConfig(): EntityConfig<Device> {
    return {
        entityName: "device",
        entityNamePlural: "devices",

        service: {
            list: async (params: any) => {
                const response = await deviceService.getDevices(params);
                return {
                    data: response.data || [],
                    meta: response.meta,
                };
            },
            getById: async (id: string) => {
                const response = await deviceService.getDeviceById(id);
                return { data: response.data! };
            },
            create: async (data: any) => {
                const response = await deviceService.createDevice(data);
                return {
                    data: response.data!,
                    message: response.message || undefined,
                };
            },
            update: async (id: string, data: any) => {
                const response = await deviceService.updateDevice(id, data);
                return {
                    data: response.data!,
                    message: response.message || undefined,
                };
            },
            delete: async (id: string) => {
                const response = await deviceService.deleteDevice(id);
                return { message: response.message || undefined };
            },
            restore: async (id: string) => {
                const response = await deviceService.restoreDevice(id);
                return { message: response.message || undefined };
            },
            hardDelete: async (id: string) => {
                const response = await deviceService.hardDeleteDevice(id);
                return { message: response.message || undefined };
            },
        },

        useQuery: useDevicesQuery,

        columns: (handlers) => createDeviceColumns(handlers),

        filters: [
            {
                id: "viewMode",
                type: "select",
                label: "View Mode",
                value: "hierarchy",
                onChange: () => { },
                options: [
                    { label: "Hierarchy", value: "hierarchy" },
                    { label: "Created By", value: "createdBy" },
                    { label: "Both", value: "both" },
                ],
            },
        ],

        dialogs: {
            create: (props) => (
                <AddDeviceDialog
                    open={props.open}
                    onOpenChange={props.onOpenChange}
                    onDeviceCreated={props.onSuccess}
                />
            ),
            edit: (props) => (
                <UpdateDeviceDialog
                    deviceId={props.entity.id}
                    open={props.open}
                    onOpenChange={props.onOpenChange}
                    onDeviceUpdated={props.onSuccess}
                />
            ),
        },

        features: {
            softDelete: true,
            hardDelete: true,
            bulkOperations: true,
            selection: true,
            columnCustomization: true,
            defaultVisibleColumns: ["status", "imei", "deviceModel", "firmware", "simNumber", "simCategory", "vehicleId", "expiryAt", "createdAt"],
            advancedFiltering: true,
            virtualScrolling: true,
            virtualScrollingThreshold: 50,
            estimatedRowHeight: 60,
            virtualContainerHeight: "600px",
        },

        messages: {
            emptyState: "Get started by registering your first device",
            deleteConfirm: (device) => device.imei,
        },

        emptyIcon: "cpu",
    };
}

export { createDeviceColumns };
