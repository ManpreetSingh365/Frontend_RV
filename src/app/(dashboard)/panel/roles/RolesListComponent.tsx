"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRolesPaginatedQuery } from "@/lib/hooks/use-queries";
import PageHeader from "./components/PageHeader";
import RoleTable from "./components/RoleTable";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { RoleDataProvider } from "@/lib/providers/role-data-provider";
import { FilterBar } from "@/components/shared/FilterBar";

interface RolesListProps {
    initialPage?: number;
    initialSearch?: string;
    initialPageSize?: number;
}


export default function RolesList({
    initialPage = 1,
    initialSearch = "",
    initialPageSize = 10,
}: RolesListProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isInitialMount = useRef(true);

    const [currentPage, setCurrentPage] = useState(initialPage);
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const { data, isLoading, isError, error, refetch } = useRolesPaginatedQuery({
        page: currentPage,
        size: pageSize,
        search: searchTerm,
    });

    const roles = data?.data || [];
    const meta = data?.meta || null;
    const loading = isLoading;
    const errorMessage = error ? (error as Error).message : null;

    useEffect(() => {
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

        const newUrl = params.toString() ? `?${params.toString()}` : "/panel/roles";
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

    const handleRoleDelete = useCallback((role: any) => {
        // TODO: Implement delete logic (soft delete)
        console.log("Delete role:", role);
        refetch();
    }, [refetch]);

    const handleRoleEdit = useCallback((role: any) => {
        // TODO: Implement edit logic (open edit dialog)
        console.log("Edit role:", role);
    }, []);

    const PageLayout = ({ children }: { children: React.ReactNode }) => (
        <div className="w-full max-w-full p-4 sm:p-6 md:p-8 overflow-x-hidden">{children}</div>
    );

    return (
        <RoleDataProvider>
            <PageLayout>
                <PageHeader onRoleCreated={refetch} />

                {loading && (
                    <>
                        <FilterBar searchValue={searchTerm} onSearchChange={handleSearchChange} />
                        <LoadingState rows={5} />
                    </>
                )}

                {isError && (
                    <ErrorState
                        title="Failed to load roles"
                        message={errorMessage || "An error occurred"}
                        onRetry={refetch}
                    />
                )}

                {!loading && !isError && roles.length === 0 && (
                    <>
                        <FilterBar searchValue={searchTerm} onSearchChange={handleSearchChange} />
                        <EmptyState
                            icon="search"
                            title="No roles found"
                            message={searchTerm ? `No results for "${searchTerm}"` : "No roles have been added yet"}
                        />
                    </>
                )}

                {!loading && !isError && roles.length > 0 && (
                    <>
                        <FilterBar searchValue={searchTerm} onSearchChange={handleSearchChange} />
                        <RoleTable roles={roles} onDelete={handleRoleDelete} onEdit={handleRoleEdit} />
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
        </RoleDataProvider>
    );
}
