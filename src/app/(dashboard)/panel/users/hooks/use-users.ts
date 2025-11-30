import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUsers } from "@/lib/service/user.service";
import { QUERY_KEYS } from "@/lib/hooks/use-queries";

interface UseUsersParams {
    page: number;
    size: number;
    search: string;
    role?: string;
}

export function useUsersQuery({ page, size, search, role }: UseUsersParams) {
    return useQuery({
        queryKey: [...QUERY_KEYS.users, { page, size, search, role }],
        queryFn: () =>
            getUsers({
                page,
                size,
                search,
                role,
                sortBy: "createdAt",
                sortOrder: "DESC",
                viewMode: "hierarchy",
            }),
        placeholderData: keepPreviousData, // Keep showing previous page data while fetching next page
        staleTime: 30 * 1000, // 30 seconds
    });
}
