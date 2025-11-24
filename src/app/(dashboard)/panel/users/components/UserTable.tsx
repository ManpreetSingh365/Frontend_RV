"use client";

import { useState, useTransition } from "react";
import { deleteUser, hardDeleteUser, User } from "@/lib/service/user.service";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Loader2 } from "lucide-react";

interface UserTableProps {
    users: User[];
    onUserDeleted?: () => void;
}

export default function UserTable({ users, onUserDeleted }: UserTableProps) {
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const isAllSelected = selectedUsers.size === users.length && users.length > 0;

    const toggleSelectAll = () => {
        setSelectedUsers(isAllSelected ? new Set() : new Set(users.map((u) => u.id)));
    };

    const toggleSelectUser = (userId: string) => {
        const newSelected = new Set(selectedUsers);
        newSelected.has(userId) ? newSelected.delete(userId) : newSelected.add(userId);
        setSelectedUsers(newSelected);
    };

    const handleDelete = async (userId: string, username: string) => {
        if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
            return;
        }

        setDeletingUserId(userId);

        startTransition(async () => {
            try {
                await deleteUser(userId);
                onUserDeleted?.();
            } catch (error) {
                console.error("Failed to delete user:", error);
                alert("Failed to delete user. Please try again.");
            } finally {
                setDeletingUserId(null);
            }
        });
    };

    const handleHardDelete = async (userId: string, username: string) => {
        if (!confirm(`Are you sure you want to hard delete user "${username}"?`)) {
            return;
        }

        setDeletingUserId(userId);

        startTransition(async () => {
            try {
                await hardDeleteUser(userId);
                onUserDeleted?.();
            } catch (error) {
                console.error("Failed to hard delete user:", error);
                alert("Failed to hard delete user. Please try again.");
            } finally {
                setDeletingUserId(null);
            }
        });
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Never";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="rounded-xl border mb-6">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">
                            <Checkbox
                                checked={isAllSelected}
                                onCheckedChange={toggleSelectAll}
                                aria-label="Select all users"
                            />
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Mobile Number</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead className="text-center">Total Vehicles</TableHead>
                        <TableHead className="text-center">Credit Limit</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={11} className="text-center text-muted-foreground py-8">
                                No users found
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedUsers.has(user.id)}
                                        onCheckedChange={() => toggleSelectUser(user.id)}
                                        aria-label={`Select ${user.username}`}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.active ? "default" : "secondary"}>
                                        {user.active ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-mono text-sm text-blue-400">
                                    {user.username}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {user.firstName} {user.lastName}
                                </TableCell>
                                <TableCell className="font-mono text-sm text-muted-foreground">
                                    {user.phoneNumber}
                                </TableCell>
                                <TableCell className="text-orange-400 capitalize">
                                    {user.role}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {user.createdBy}
                                </TableCell>
                                <TableCell className="text-center font-medium">
                                    {user.vehiclesIds?.length || 0}
                                </TableCell>
                                <TableCell className="text-center">-</TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {formatDate(user.createdAt)}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {formatDate(user.lastLogin)}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" disabled={deletingUserId === user.id}>
                                                {deletingUserId === user.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <MoreVertical className="h-4 w-4" />
                                                )}
                                                <span className="sr-only">Actions</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={() => handleDelete(user.id, user.username)}
                                                disabled={deletingUserId === user.id}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={() => handleHardDelete(user.id, user.username)}
                                                disabled={deletingUserId === user.id}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Hard Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
