import { useState, useEffect, useCallback } from "react";
import { getUsers, User } from "@/lib/service/user.service";
import { PaginationMeta } from "@/lib/api/types";

interface UseUsersParams {
    page: number;
    size: number;
    search: string;
}

interface UseUsersReturn {
    users: User[];
    meta: PaginationMeta | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useUsers({ page, size, search }: UseUsersParams): UseUsersReturn {
    const [state, setState] = useState<{
        users: User[];
        meta: PaginationMeta | null;
        loading: boolean;
        error: string | null;
    }>({
        users: [],
        meta: null,
        loading: true,
        error: null,
    });

    const fetchUsers = useCallback(async () => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const response = await getUsers({
                page,
                size,
                search,
                sortBy: "createdAt",
                sortOrder: "DESC",
                viewMode: "hierarchy",
            });

            setState({
                users: response.data,
                meta: response.meta,
                loading: false,
                error: null,
            });
        } catch (err) {
            setState({
                users: [],
                meta: null,
                loading: false,
                error: err instanceof Error ? err.message : "Failed to fetch users",
            });
        }
    }, [page, size, search]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        ...state,
        refetch: fetchUsers,
    };
}
