// src/hooks/useVehicles.ts
import { useState, useEffect } from "react";
import { getVehicles, type VehicleResponse } from "@/lib/service/vehicle.services";

interface UseVehiclesReturn {
    vehicles: VehicleResponse[];
    loading: boolean;
    error: string | null;
}

export function useVehicles(params?: { status?: string }) {
    const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setLoading(true);
                const data = await getVehicles({
                    status: params?.status || undefined
                });

                setVehicles(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch vehicles:", err);
                setError(err instanceof Error ? err.message : "Failed to fetch vehicles");
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, [params?.status]);

    return { vehicles, loading, error };
}
