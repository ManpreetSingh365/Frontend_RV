"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "./components/PageHeader";
import FilterBar from "./components/FilterBar";
import UserTable from "./components/UserTable";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { UserDataProvider, useUserData } from "@/lib/providers/user-data-provider";
import { useUsersQuery } from "@/lib/hooks/use-queries";

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
    const [selectedRole, setSelectedRole] = useState("all");

    const { data, isLoading, isError, error, refetch } = useUsersQuery({
        page: currentPage,
        size: pageSize,
        search: searchTerm,
        role: selectedRole === "all" ? "" : selectedRole,
    });

    const users = data?.data || [];
    const meta = data?.meta || null;
    const loading = isLoading;
    const errorMessage = error ? (error as Error).message : null;

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

        if (selectedRole && selectedRole !== "all") {
            params.set("role", selectedRole);
        }

        const newUrl = params.toString() ? `?${params.toString()}` : "/panel/users";
        router.replace(newUrl, { scroll: false });
    }, [currentPage, searchTerm, pageSize, selectedRole, router]);

    const handleSearchChange = useCallback((search: string) => {
        setSearchTerm(search);
        setCurrentPage(1);
    }, []);

    const handleRoleChange = useCallback((role: string) => {
        setSelectedRole(role);
        setCurrentPage(1);
    }, []);

    const handlePageSizeChange = useCallback((size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    }, []);

    // Reusable layout wrapper
    const PageLayout = ({ children }: { children: React.ReactNode }) => (
        <div className="w-full max-w-full p-4 sm:p-6 md:p-8 overflow-x-hidden">{children}</div>
    );

    return (
        <UserDataProvider>
            <PageLayout>
                <PageHeader onUserCreated={refetch} />

                {loading && (
                    <>
                        <FilterBar searchTerm={searchTerm} onSearchChange={handleSearchChange} selectedRole={selectedRole} onRoleChange={handleRoleChange} />
                        <LoadingState rows={5} />
                    </>
                )}

                {isError && (
                    <ErrorState
                        title="Failed to load users"
                        message={errorMessage || "An error occurred"}
                        onRetry={refetch}
                    />
                )}

                {!loading && !isError && users.length === 0 && (
                    <>
                        <FilterBar searchTerm={searchTerm} onSearchChange={handleSearchChange} selectedRole={selectedRole} onRoleChange={handleRoleChange} />
                        <EmptyState
                            icon="search"
                            title="No users found"
                            message={searchTerm ? `No results for "${searchTerm}"` : "No users have been added yet"}
                        />
                    </>
                )}

                {!loading && !isError && users.length > 0 && (
                    <>
                        <FilterBar searchTerm={searchTerm} onSearchChange={handleSearchChange} selectedRole={selectedRole} onRoleChange={handleRoleChange} />
                        <UserTable users={users} onUserDeleted={refetch} />
                        {meta && (
                            <DataTablePagination
                                currentPage={currentPage}
                                totalPages={meta.totalPages}
                                totalItems={meta.totalElements}
                                pageSize={pageSize}
                                onPageChange={setCurrentPage}
                                onPageSizeChange={handlePageSizeChange}
                            />
                        )}
                    </>
                )}
            </PageLayout>
        </UserDataProvider>
    );
}
