import { EntityConfig } from "@/lib/types/entity-config";
import { createVehicleColumns, Vehicle } from "./columns";
import * as vehicleService from "@/lib/service/vehicle.service";
import { useVehiclesPaginatedQuery } from "@/lib/hooks";
import AddVehicleDialog from "../components/dialogs/AddVehicleDialog";
import UpdateVehicleDialog from "../components/dialogs/UpdateVehicleDialog";

/**
 * Complete entity configuration for Vehicles
 */
export function createVehiclesConfig(): EntityConfig<Vehicle> {
    return {
        entityName: "vehicle",
        entityNamePlural: "vehicles",

        service: {
            list: async (params: any) => {
                const response = await vehicleService.getVehiclesPaginated(params);
                return {
                    data: response.data || [],
                    meta: response.meta,
                };
            },
            getById: async (id: string) => {
                const response = await vehicleService.getVehicleById(id);
                return { data: response.data! };
            },
            create: async (data: any) => {
                const response = await vehicleService.createVehicle(data);
                return {
                    data: response.data!,
                    message: response.message || undefined,
                };
            },
            update: async (id: string, data: any) => {
                const response = await vehicleService.updateVehicle(id, data);
                return {
                    data: response.data!,
                    message: response.message || undefined,
                };
            },
            delete: async (id: string) => {
                const response = await vehicleService.deleteVehicle(id);
                return { message: response.message || undefined };
            },
            restore: async (id: string) => {
                const response = await vehicleService.restoreVehicle(id);
                return { message: response.message || undefined };
            },
            hardDelete: async (id: string) => {
                const response = await vehicleService.hardDeleteVehicle(id);
                return { message: response.message || undefined };
            },
        },

        useQuery: useVehiclesPaginatedQuery,

        columns: (handlers) => createVehicleColumns(handlers),

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
                <AddVehicleDialog
                    open={props.open}
                    onOpenChange={props.onOpenChange}
                    onVehicleCreated={props.onSuccess}
                />
            ),
            edit: (props) => (
                <UpdateVehicleDialog
                    vehicleId={props.entity.id}
                    open={props.open}
                    onOpenChange={props.onOpenChange}
                    onVehicleUpdated={props.onSuccess}
                />
            ),
        },

        features: {
            softDelete: true,
            hardDelete: true,
            bulkOperations: true,
            selection: true,
            columnCustomization: true,
            defaultVisibleColumns: ["status", "licensePlate", "brand", "model", "year", "vehicleType", "vehicleOwner", "device", "users", "createdAt"],
            advancedFiltering: true,
            virtualScrolling: true,
            virtualScrollingThreshold: 50,
            estimatedRowHeight: 60,
            virtualContainerHeight: "600px",
        },

        messages: {
            emptyState: "Get started by registering your first vehicle",
            deleteConfirm: (vehicle) => vehicle.licensePlate,
        },

        emptyIcon: "truck",
    };
}

export { createVehicleColumns };
