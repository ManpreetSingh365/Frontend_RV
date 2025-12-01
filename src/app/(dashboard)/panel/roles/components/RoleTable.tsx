"use client";

import { useState, useTransition } from "react";
import { deleteRole, hardDeleteRole, Role } from "@/lib/service/role.services";
import UpdateRoleDialog from "./UpdateRoleDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Loader2, MoreVertical, Shield } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface RoleTableProps {
    roles: Role[];
    onRoleDeleted?: () => void;
}

export default function RoleTable({ roles, onRoleDeleted }: RoleTableProps) {
    const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
    const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);
    const [, startTransition] = useTransition();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<{ id: string; name: string; isHard: boolean } | null>(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [roleToUpdate, setRoleToUpdate] = useState<string | null>(null);

    const isAllSelected = selectedRoles.size === roles.length && roles.length > 0;

    const toggleSelectAll = () => {
        setSelectedRoles(isAllSelected ? new Set() : new Set(roles.map((r) => r.id)));
    };

    const toggleSelectRole = (roleId: string) => {
        const newSelected = new Set(selectedRoles);
        if (newSelected.has(roleId)) {
            newSelected.delete(roleId);
        } else {
            newSelected.add(roleId);
        }
        setSelectedRoles(newSelected);
    };

    const openDeleteDialog = (roleId: string, name: string, isHard: boolean) => {
        setRoleToDelete({ id: roleId, name, isHard });
        setDeleteDialogOpen(true);
    };

    const openUpdateDialog = (roleId: string) => {
        setRoleToUpdate(roleId);
        setUpdateDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!roleToDelete) return;
        setDeletingRoleId(roleToDelete.id);
        setDeleteDialogOpen(false);

        startTransition(async () => {
            try {
                if (roleToDelete.isHard) {
                    await hardDeleteRole(roleToDelete.id);
                    toast.success(`Role "${roleToDelete.name}" permanently deleted`);
                } else {
                    await deleteRole(roleToDelete.id);
                    toast.success(`Role "${roleToDelete.name}" deleted successfully`);
                }
                onRoleDeleted?.();
            } catch (error: any) {
                const errorMsg = error.messages?.[0] || error.message || "Failed to delete role";
                toast.error(errorMsg);
            } finally {
                setDeletingRoleId(null);
                setRoleToDelete(null);
            }
        });
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Never";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    };

    return (
        <>
            <div className="w-full mb-4 sm:mb-6">
                <div className="overflow-x-auto sm:overflow-hidden -mx-4 sm:mx-0 px-4 sm:px-0">
                    <div className="min-w-full sm:min-w-0 inline-block sm:block">
                        <div className="border-y sm:border-x sm:rounded-xl bg-background">
                            <Table className="min-w-full sm:w-full sm:table-fixed">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12 sm:w-[3%] pl-4 sm:pl-6 sticky left-0 sm:static z-[1] sm:z-auto bg-background">
                                            <Checkbox
                                                checked={isAllSelected}
                                                onCheckedChange={toggleSelectAll}
                                                aria-label="Select all roles"
                                            />
                                        </TableHead>
                                        <TableHead className="min-w-[80px] sm:w-[8%] text-xs sm:text-sm">Status</TableHead>
                                        <TableHead className="min-w-[120px] sm:w-[15%] text-xs sm:text-sm">Name</TableHead>
                                        <TableHead className="min-w-[200px] sm:w-[25%] text-xs sm:text-sm">Description</TableHead>
                                        <TableHead className="text-center min-w-[80px] sm:w-[8%] text-xs sm:text-sm">Level</TableHead>
                                        <TableHead className="text-center min-w-[80px] sm:w-[8%] text-xs sm:text-sm">Users</TableHead>
                                        <TableHead className="min-w-[120px] sm:w-[18%] text-xs sm:text-sm">Permissions</TableHead>
                                        <TableHead className="min-w-[120px] sm:w-[12%] text-xs sm:text-sm">Created</TableHead>
                                        <TableHead className="pr-4 sm:pr-6 sticky right-0 sm:static z-[1] sm:z-auto bg-background min-w-[60px] sm:w-[6%]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <Shield className="h-12 w-12 stroke-1" />
                                                    <p className="text-lg font-medium">No roles found</p>
                                                    <p className="text-sm">Get started by adding a new role</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        roles.map((role) => (
                                            <TableRow key={role.id}>
                                                <TableCell className="pl-4 sm:pl-6 sticky left-0 sm:static z-[1] sm:z-auto bg-background py-3 sm:py-4">
                                                    <Checkbox
                                                        checked={selectedRoles.has(role.id)}
                                                        onCheckedChange={() => toggleSelectRole(role.id)}
                                                        aria-label={`Select ${role.name}`}
                                                    />
                                                </TableCell>
                                                <TableCell className="py-3 sm:py-4">
                                                    <span className={`inline-flex w-[60px] justify-center rounded-full border px-2 py-1 text-xs font-medium ${role.active
                                                        ? "border-green-500/40 bg-green-500/15 text-green-500"
                                                        : "border-red-500/40 bg-red-500/15 text-red-500"
                                                        }`}>
                                                        {role.active ? "Active" : "Inactive"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-medium whitespace-nowrap py-3 sm:py-4 truncate">
                                                    {role.name}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground py-3 sm:py-4 truncate max-w-[200px]">
                                                    {role.description || "-"}
                                                </TableCell>
                                                <TableCell className="text-center font-medium py-3 sm:py-4">
                                                    {role.roleLevel}
                                                </TableCell>
                                                <TableCell className="text-center font-medium py-3 sm:py-4">
                                                    {role.assignedUserCount}
                                                </TableCell>
                                                <TableCell className="py-3 sm:py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {role.permissions?.slice(0, 2).map((perm, i) => (
                                                            <Badge key={i} variant="secondary" className="text-xs">
                                                                {perm}
                                                            </Badge>
                                                        ))}
                                                        {role.permissions && role.permissions.length > 2 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{role.permissions.length - 2}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-xs sm:text-sm whitespace-nowrap py-3 sm:py-4 truncate">
                                                    {formatDate(role.createdAt)}
                                                </TableCell>
                                                <TableCell className="pr-4 sm:pr-6 sticky right-0 sm:static z-[1] sm:z-auto bg-background py-3 sm:py-4">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" disabled={deletingRoleId === role.id}>
                                                                {deletingRoleId === role.id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <MoreVertical className="h-4 w-4" />
                                                                )}
                                                                <span className="sr-only">Actions</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => openUpdateDialog(role.id)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onClick={() => openDeleteDialog(role.id, role.name, false)}
                                                                disabled={deletingRoleId === role.id}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onClick={() => openDeleteDialog(role.id, role.name, true)}
                                                                disabled={deletingRoleId === role.id}
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
                    </div>
                </div>
            </div>

            {roleToUpdate && (
                <UpdateRoleDialog
                    roleId={roleToUpdate}
                    open={updateDialogOpen}
                    onOpenChange={setUpdateDialogOpen}
                    onRoleUpdated={onRoleDeleted}
                />
            )}

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {roleToDelete?.isHard ? "Permanently Delete Role?" : "Delete Role?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {roleToDelete?.isHard ? (
                                <>
                                    This will <strong>permanently delete</strong> the role{" "}
                                    <span className="font-semibold text-foreground">"{roleToDelete?.name}"</span> from the System.
                                    Can't Restore Back.
                                </>
                            ) : (
                                <>
                                    This will delete the role{" "}
                                    <span className="font-semibold text-foreground">"{roleToDelete?.name}"</span>.
                                    You may be able to restore this role later.
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
                            {roleToDelete?.isHard ? "Permanently Delete" : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
