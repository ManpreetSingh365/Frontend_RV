"use client";

import { useState } from "react";
import { useUsers } from "./hooks/use-users";
import PageHeader from "./components/PageHeader";
import FilterBar from "./components/FilterBar";
import UserTable from "./components/UserTable";
import Pagination from "./components/Pagination";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

export default function UsersList({
    initialPage = 1,
    initialSearch = "",
}: {
    initialPage?: number;
    initialSearch?: string;
}) {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [searchTerm, setSearchTerm] = useState(initialSearch);

    const { users, loading, error, refetch } = useUsers({
        page: currentPage,
        search: searchTerm,
    });

    const handleSearchChange = (search: string) => {
        setSearchTerm(search);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="min-h-screen p-8">
                <PageHeader />
                <FilterBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
                <LoadingState rows={5} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen p-8">
                <PageHeader />
                <ErrorState
                    title="Failed to load users"
                    message={error}
                    onRetry={refetch}
                />
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="min-h-screen p-8">
                <PageHeader />
                <FilterBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
                <EmptyState
                    icon="search"
                    title="No users found"
                    message={searchTerm ? `No results for "${searchTerm}"` : "No users have been added yet"}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8">
            <PageHeader onUserCreated={refetch} />
            <FilterBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
            <UserTable users={users} onUserDeleted={refetch} />
            <Pagination
                currentPage={currentPage}
                totalPages={1}
                totalItems={users.length}
                itemsPerPage={10}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}
