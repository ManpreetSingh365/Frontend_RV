import { useState, useEffect } from "react";
import { getAddressTypes, type AddressTypeResponse } from "@/lib/service/type.services";

interface UseAddressTypesReturn {
    addressTypes: AddressTypeResponse[];
    loading: boolean;
    error: string | null;
}

export function useAddressTypes(): UseAddressTypesReturn {
    const [addressTypes, setAddressTypes] = useState<AddressTypeResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAddressTypes = async () => {
            try {
                setLoading(true);
                const data = await getAddressTypes();
                setAddressTypes(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch address types");
                console.error("Failed to fetch address types:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAddressTypes();
    }, []);

    return { addressTypes, loading, error };
}
