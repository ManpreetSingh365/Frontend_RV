import { useQuery, keepPreviousData } from "@tanstack/react-query";

export interface PaginationParams {
    page: number;
    size: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    [key: string]: any; // Additional filter parameters
}

interface UsePaginatedQueryOptions<TData, TParams extends PaginationParams> {
    queryKey: readonly any[];
    queryFn: (params: TParams) => Promise<TData>;
    params: TParams;
    staleTime?: number;
    enabled?: boolean;
}

/**
 * Generic hook for paginated, filtered entity queries
 * Handles pagination state, search, sorting with optimal UX via placeholderData
 */
export function usePaginatedQuery<TData, TParams extends PaginationParams>({
    queryKey,
    queryFn,
    params,
    staleTime = 30 * 1000, // 30 seconds default
    enabled = true,
}: UsePaginatedQueryOptions<TData, TParams>) {
    return useQuery({
        queryKey: [...queryKey, params],
        queryFn: () => queryFn(params),
        placeholderData: keepPreviousData, // Keep showing previous data while fetching
        staleTime,
        enabled,
    });
}
