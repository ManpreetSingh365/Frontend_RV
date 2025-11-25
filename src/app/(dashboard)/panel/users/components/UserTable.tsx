"use client";

import { useState, useTransition } from "react";
import { deleteUser, hardDeleteUser, User } from "@/lib/service/user.service";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Loader2, MoreVertical, UserX } from "lucide-react";
import { toast } from "sonner";

interface UserTableProps {
    users: User[];
    onUserDeleted?: () => void;
}

export default function UserTable({ users, onUserDeleted }: UserTableProps) {
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    // AlertDialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<{ id: string; username: string; isHard: boolean } | null>(null);

    const isAllSelected = selectedUsers.size === users.length && users.length > 0;

    const toggleSelectAll = () => {
        setSelectedUsers(isAllSelected ? new Set() : new Set(users.map((u) => u.id)));
    };

    const toggleSelectUser = (userId: string) => {
        const newSelected = new Set(selectedUsers);
        newSelected.has(userId) ? newSelected.delete(userId) : newSelected.add(userId);
        setSelectedUsers(newSelected);
    };

    const openDeleteDialog = (userId: string, username: string, isHard: boolean) => {
        setUserToDelete({ id: userId, username, isHard });
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        setDeletingUserId(userToDelete.id);
        setDeleteDialogOpen(false);

        startTransition(async () => {
            try {
                if (userToDelete.isHard) {
                    await hardDeleteUser(userToDelete.id);
                    toast.success(`User "${userToDelete.username}" permanently deleted`);
                } else {
                    await deleteUser(userToDelete.id);
                    toast.success(`User "${userToDelete.username}" deleted successfully`);
                }
                onUserDeleted?.();
            } catch (error: any) {
                const errorMsg = error.messages?.[0] || error.message || "Failed to delete user";
                toast.error(errorMsg);
            } finally {
                setDeletingUserId(null);
                setUserToDelete(null);
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
        <>
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
                                <TableCell colSpan={12} className="text-center py-12">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <UserX className="h-12 w-12 stroke-1" />
                                        <p className="text-lg font-medium">No users found</p>
                                        <p className="text-sm">Get started by adding a new user</p>
                                    </div>
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
                                        <span
                                            className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${user.active
                                                ? "bg-green-500/15 text-green-500 border border-green-500/40"
                                                : "bg-red-500/15 text-red-500 border border-red-500/40"}`}
                                        >
                                            {user.active ? "Active" : "Inactive"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm text-primary">
                                        {user.username}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {user.firstName} {user.lastName}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm text-muted-foreground">
                                        {user.phoneNumber}
                                    </TableCell>
                                    <TableCell className="text-accent-foreground capitalize">
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
                                                    onClick={() => openDeleteDialog(user.id, user.username, false)}
                                                    disabled={deletingUserId === user.id}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => openDeleteDialog(user.id, user.username, true)}
                                                    disabled={deletingUserId === user.id}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Permanently Delete
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {userToDelete?.isHard ? "Permanently Delete User?" : "Delete User?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {userToDelete?.isHard ? (
                                <>
                                    This will <strong>permanently delete</strong> the user{" "}
                                    <span className="font-semibold text-foreground">"{userToDelete?.username}"</span> from the System.
                                    Can't Restore Back.
                                </>
                            ) : (
                                <>
                                    This will delete the user{" "}
                                    <span className="font-semibold text-foreground">"{userToDelete?.username}"</span>.
                                    You may be able to restore this user later.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {userToDelete?.isHard ? "Permanently Delete" : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
