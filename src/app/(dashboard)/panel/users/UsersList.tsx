"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUsers } from "./hooks/use-users";
import PageHeader from "./components/PageHeader";
import FilterBar from "./components/FilterBar";
import UserTable from "./components/UserTable";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

interface UsersListProps {
    initialPage?: number;
    initialSearch?: string;
    initialPageSize?: number;
}

export default function UsersList({
    initialPage = 1,
    initialSearch = "",
    initialPageSize = 10,
}: UsersListProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isInitialMount = useRef(true);

    const [currentPage, setCurrentPage] = useState(initialPage);
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const { users, meta, loading, error, refetch } = useUsers({
        page: currentPage,
        size: pageSize,
        search: searchTerm,
    });

    // Sync state with URL (only when state changes, not when URL changes)
    useEffect(() => {
        // Skip URL sync on initial mount to prevent unnecessary navigation
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const params = new URLSearchParams();

        if (currentPage > 1) {
            params.set("page", currentPage.toString());
        }

        if (searchTerm) {
            params.set("search", searchTerm);
        }

        if (pageSize !== 10) {
            params.set("size", pageSize.toString());
        }

        const newUrl = params.toString() ? `?${params.toString()}` : "/panel/users";
        router.replace(newUrl, { scroll: false });
    }, [currentPage, searchTerm, pageSize, router]);

    const handleSearchChange = useCallback((search: string) => {
        setSearchTerm(search);
        setCurrentPage(1);
    }, []);

    const handlePageSizeChange = useCallback((size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    }, []);

    // Reusable layout wrapper
    const PageLayout = ({ children }: { children: React.ReactNode }) => (
        <div className="min-h-screen p-8">{children}</div>
    );

    if (loading) {
        return (
            <PageLayout>
                <PageHeader onUserCreated={refetch} />
                <FilterBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
                <LoadingState rows={5} />
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout>
                <PageHeader onUserCreated={refetch} />
                <ErrorState
                    title="Failed to load users"
                    message={error}
                    onRetry={refetch}
                />
            </PageLayout>
        );
    }

    if (users.length === 0) {
        return (
            <PageLayout>
                <PageHeader onUserCreated={refetch} />
                <FilterBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
                <EmptyState
                    icon="search"
                    title="No users found"
                    message={searchTerm ? `No results for "${searchTerm}"` : "No users have been added yet"}
                />
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <PageHeader onUserCreated={refetch} />
            <FilterBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
            <UserTable users={users} onUserDeleted={refetch} />
            {meta && (
                <DataTablePagination
                    currentPage={meta.currentPageNo}
                    totalPages={meta.totalPages}
                    totalItems={meta.totalElements}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}
        </PageLayout>
    );
}
