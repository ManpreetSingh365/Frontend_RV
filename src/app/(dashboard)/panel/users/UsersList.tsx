"use client";

import { useEffect, useState } from "react";
import { getUsers, User } from "@/lib/service/user.service";

export default function UsersList({
    initialPage = 1,
    initialSize = 10,
    initialSearch = "",
}: {
    initialPage?: number;
    initialSize?: number;
    initialSearch?: string;
}) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                setLoading(true);
                setError(null);

                const data = await getUsers({
                    page: initialPage,
                    size: initialSize,
                    search: initialSearch,
                    sortBy: "createdAt",
                    sortOrder: "DESC",
                    viewMode: "hierarchy",
                });

                setUsers(data);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError(err instanceof Error ? err.message : "Failed to fetch users");
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, [initialPage, initialSize, initialSearch]);

    if (loading) {
        return (
            <div>
                <h1>Users</h1>
                <p>Loading users...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1>Users</h1>
                <div style={{ color: "red" }}>
                    <p>Error loading users</p>
                    <div>{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1>Users</h1>
            <pre>{JSON.stringify(users, null, 2)}</pre>
        </div>
    );
}
