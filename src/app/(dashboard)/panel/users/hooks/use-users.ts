import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUsers } from "@/lib/service/user.service";
import { QUERY_KEYS } from "@/lib/hooks/use-queries";

interface UseUsersParams {
    page: number;
    size: number;
    search: string;
}

export function useUsersQuery({ page, size, search }: UseUsersParams) {
    return useQuery({
        queryKey: [...QUERY_KEYS.users, { page, size, search }],
        queryFn: () =>
            getUsers({
                page,
                size,
                search,
                sortBy: "createdAt",
                sortOrder: "DESC",
                viewMode: "hierarchy",
            }),
        placeholderData: keepPreviousData, // Keep showing previous page data while fetching next page
        staleTime: 30 * 1000, // 30 seconds
    });
}
