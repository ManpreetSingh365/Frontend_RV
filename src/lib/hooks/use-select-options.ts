import { useMemo } from "react";
import { useRolesQuery, useVehiclesQuery, useAddressTypesQuery } from "./use-queries";
import type { SelectOption } from "@/lib/types/entity";

type OptionType = "roles" | "vehicles" | "addressTypes";

/**
 * Hook to fetch and transform entity data into select options
 * Prevents duplication of "load options" logic across components
 * 
 * @example
 * const { options, isLoading } = useSelectOptions("roles");
 * 
 * <Select>
 *   {options.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
 * </Select>
 * 
 * @param type - Type of options to fetch (roles, vehicles, addressTypes)
 */
export function useSelectOptions(type: OptionType) {
    const rolesQuery = useRolesQuery(type === "roles" ? {} : undefined);
    const vehiclesQuery = useVehiclesQuery();
    const addressTypesQuery = useAddressTypesQuery();

    const query = useMemo(() => {
        switch (type) {
            case "roles":
                return rolesQuery;
            case "vehicles":
                return vehiclesQuery;
            case "addressTypes":
                return addressTypesQuery;
            default:
                return { data: [], isLoading: false, error: null };
        }
    }, [type, rolesQuery, vehiclesQuery, addressTypesQuery]);

    const options: SelectOption[] = useMemo(() => {
        if (!query.data) return [];

        switch (type) {
            case "roles":
                return (query.data as any[]).map((role) => ({
                    label: role.name,
                    value: role.id || role.name,
                }));
            case "vehicles":
                return (query.data as any[]).map((vehicle) => ({
                    label: vehicle.name || vehicle.vehicleId,
                    value: vehicle.id || vehicle.vehicleId,
                }));
            case "addressTypes":
                return (query.data as any[]).map((type) => ({
                    label: type.label || type.name || type,
                    value: type.value || type.name || type,
                }));
            default:
                return [];
        }
    }, [query.data, type]);

    return {
        options,
        isLoading: query.isLoading,
        error: query.error,
    };
}
