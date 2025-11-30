"use client";

import { useState, useTransition } from "react";
import { deleteUser, hardDeleteUser, User } from "@/lib/service/user.service";
import UpdateUserDialog from "./UpdateUserDialog";
import { Checkbox } from "@/components/ui/checkbox";

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
    const [, startTransition] = useTransition();

    // AlertDialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<{ id: string; username: string; isHard: boolean } | null>(null);

    // UpdateUserDialog state
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [userToUpdate, setUserToUpdate] = useState<string | null>(null);

    const isAllSelected = selectedUsers.size === users.length && users.length > 0;

    const toggleSelectAll = () => {
        setSelectedUsers(isAllSelected ? new Set() : new Set(users.map((u) => u.id)));
    };

    const toggleSelectUser = (userId: string) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedUsers(newSelected);
    };

    const openDeleteDialog = (userId: string, username: string, isHard: boolean) => {
        setUserToDelete({ id: userId, username, isHard });
        setDeleteDialogOpen(true);
    };

    const openUpdateDialog = (userId: string) => {
        setUserToUpdate(userId);
        setUpdateDialogOpen(true);
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
                {/* Desktop Table View */}
                <Table className="hidden md:table">
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
                                            className={`inline-flex w-[60px] justify-center rounded-full border px-2 py-1 text-xs font-medium ${user.active
                                                ? "border-green-500/40 bg-green-500/15 text-green-500"
                                                : "border-red-500/40 bg-red-500/15 text-red-500"}`}
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
                                                <DropdownMenuItem onClick={() => openUpdateDialog(user.id)}>
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

                {/* Mobile Card View */}
                <div className="block md:hidden space-y-4">
                    {users.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground border rounded-lg bg-card/50">
                            <UserX className="h-12 w-12 stroke-1" />
                            <p className="text-lg font-medium">No users found</p>
                            <p className="text-sm">Get started by adding a new user</p>
                        </div>
                    ) : (
                        users.map((user) => (
                            <div
                                key={user.id}
                                className={`flex flex-col gap-3 p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-colors ${selectedUsers.has(user.id) ? "border-primary/50 bg-primary/5" : ""
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={selectedUsers.has(user.id)}
                                            onCheckedChange={() => toggleSelectUser(user.id)}
                                            aria-label={`Select ${user.username}`}
                                            className="mt-1"
                                        />
                                        <div>
                                            <div className="font-semibold text-base">
                                                {user.firstName} {user.lastName}
                                            </div>
                                            <div className="text-xs text-muted-foreground font-mono">
                                                @{user.username}
                                            </div>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8" disabled={deletingUserId === user.id}>
                                                {deletingUserId === user.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <MoreVertical className="h-4 w-4" />
                                                )}
                                                <span className="sr-only">Actions</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openUpdateDialog(user.id)}>
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
                                </div>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm pt-2 border-t">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Status</span>
                                        <span
                                            className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-xs font-medium ${user.active
                                                ? "border-green-500/40 bg-green-500/15 text-green-500"
                                                : "border-red-500/40 bg-red-500/15 text-red-500"}`}
                                        >
                                            {user.active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Role</span>
                                        <span className="capitalize font-medium">{user.role}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Phone</span>
                                        <span className="font-mono text-xs">{user.phoneNumber}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Vehicles</span>
                                        <span className="font-medium">{user.vehiclesIds?.length || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Update User Dialog */}
            {userToUpdate && (
                <UpdateUserDialog
                    userId={userToUpdate}
                    open={updateDialogOpen}
                    onOpenChange={setUpdateDialogOpen}
                    onUserUpdated={onUserDeleted}
                />
            )}

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
                                    <span className="font-semibold text-foreground">&quot;{userToDelete?.username}&quot;</span> from the System.
                                    Can&apos;t Restore Back.
                                </>
                            ) : (
                                <>
                                    This will delete the user{" "}
                                    <span className="font-semibold text-foreground">&quot;{userToDelete?.username}&quot;</span>.
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
