import { useState, useCallback, useMemo } from "react";

interface UsePaginationProps {
    initialPage?: number;
    initialPageSize?: number;
    totalPages?: number;
}

/**
 * Hook to manage pagination state with navigation helpers
 * 
 * @example
 * const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });
 * 
 * <DataTable page={pagination.page} pageSize={pagination.pageSize} />
 * <Button onClick={pagination.goToNext} disabled={!pagination.canGoNext}>Next</Button>
 * 
 * @param initialPage - Starting page number (default: 1)
 * @param initialPageSize - Items per page (default: 10)
 * @param totalPages - Total available pages
 */
export function usePagination({
    initialPage = 1,
    initialPageSize = 10,
    totalPages,
}: UsePaginationProps = {}) {
    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const canGoNext = useMemo(() => {
        return totalPages ? page < totalPages : true;
    }, [page, totalPages]);

    const canGoPrev = useMemo(() => {
        return page > 1;
    }, [page]);

    const goToNext = useCallback(() => {
        if (canGoNext) {
            setPage((prev) => prev + 1);
        }
    }, [canGoNext]);

    const goToPrev = useCallback(() => {
        if (canGoPrev) {
            setPage((prev) => prev - 1);
        }
    }, [canGoPrev]);

    const goToPage = useCallback((pageNumber: number) => {
        if (pageNumber > 0 && (!totalPages || pageNumber <= totalPages)) {
            setPage(pageNumber);
        }
    }, [totalPages]);

    const changePageSize = useCallback((newSize: number) => {
        setPageSize(newSize);
        setPage(1); // Reset to first page when changing page size
    }, []);

    const reset = useCallback(() => {
        setPage(initialPage);
        setPageSize(initialPageSize);
    }, [initialPage, initialPageSize]);

    return {
        page,
        pageSize,
        setPage,
        setPageSize: changePageSize,
        goToNext,
        goToPrev,
        goToPage,
        canGoNext,
        canGoPrev,
        reset,
    };
}
