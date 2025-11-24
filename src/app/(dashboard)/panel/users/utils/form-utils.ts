import type { ComboboxOption } from "@/components/ui/searchable-combobox";
import type { Role } from "@/lib/service/role.services";
import type { VehicleResponse } from "@/lib/service/vehicle.services";

export function transformRolesToOptions(roles: Role[]): ComboboxOption[] {
    return roles.map((role) => ({
        value: role.id,
        label: role.name,
        description: role.description,
    }));
}

export function transformVehiclesToOptions(vehicles: VehicleResponse[]): ComboboxOption[] {
    return vehicles.map((vehicle) => ({
        value: vehicle.id,
        label: `${vehicle.licensePlate} - ${vehicle.brand} ${vehicle.model}`,
        description: `VIN: ${vehicle.vin} • ${vehicle.vehicleType}`,
    }));
}

export function transformAddressTypesToOptions(
    addressTypes: Array<{ name: string; description: string }>
): ComboboxOption[] {
    return addressTypes.map((type) => ({
        value: type.name,
        label: type.name,
        description: type.description,
    }));
}
