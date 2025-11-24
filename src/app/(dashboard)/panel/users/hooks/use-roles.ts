import { useState, useEffect } from "react";
import { getRoles, type Role } from "@/lib/service/role.services";

interface UseRolesReturn {
    roles: Role[];
    loading: boolean;
    error: string | null;
}

export function useRoles(): UseRolesReturn {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoading(true);
                const data = await getRoles({ viewMode: "hierarchy" }); // createdBy, hierarchy, both
                setRoles(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch roles");
                console.error("Failed to fetch roles:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    return { roles, loading, error };
}
