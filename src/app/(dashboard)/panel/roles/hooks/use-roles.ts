import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getRoles } from "@/lib/service/role.services";
import { QUERY_KEYS } from "@/lib/hooks/use-queries";

interface UseRolesParams {
    page: number;
    size: number;
    search: string;
}

export function useRolesQuery({ page, size, search }: UseRolesParams) {
    return useQuery({
        queryKey: [...QUERY_KEYS.roles, { page, size, search }],
        queryFn: () =>
            getRoles({
                page,
                size,
                search,
                sortBy: "createdAt",
                sortOrder: "DESC",
                viewMode: "hierarchy",
            }),
        placeholderData: keepPreviousData,
        staleTime: 30 * 1000,
    });
}
