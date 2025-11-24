import { useState, useEffect } from "react";
import { getUsers, User } from "@/lib/service/user.service";

interface UseUsersParams {
    page: number;
    search: string;
}

interface UseUsersReturn {
    users: User[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

const ITEMS_PER_PAGE = 10;

export function useUsers({ page, search }: UseUsersParams): UseUsersReturn {
    const [state, setState] = useState<{
        users: User[];
        loading: boolean;
        error: string | null;
    }>({
        users: [],
        loading: true,
        error: null,
    });

    const fetchUsers = async () => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const users = await getUsers({
                page,
                size: ITEMS_PER_PAGE,
                search,
                sortBy: "createdAt",
                sortOrder: "DESC",
                viewMode: "hierarchy",
            });

            setState({ users, loading: false, error: null });
        } catch (err) {
            setState({
                users: [],
                loading: false,
                error: err instanceof Error ? err.message : "Failed to fetch users",
            });
        }
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search]);

    return {
        ...state,
        refetch: fetchUsers,
    };
}
