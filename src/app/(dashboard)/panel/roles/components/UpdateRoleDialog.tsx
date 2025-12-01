"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AlertMessage } from "@/components/ui/alert-message";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getRoleById, updateRole, type Role } from "@/lib/service/role.services";
import { updateRoleSchema, type UpdateRoleInput, type CreateRoleInput } from "@/lib/validation/role.schema";
import { useRoleData } from "../providers/data-provider";
import { RoleDetailsForm } from "./forms/RoleDetailsForm";
import { handleApiFormErrors } from "@/lib/util/form-errors";

interface UpdateRoleDialogProps {
    roleId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRoleUpdated?: () => void;
}

export default function UpdateRoleDialog({ roleId, open, onOpenChange, onRoleUpdated }: UpdateRoleDialogProps) {
    const [isPending, setIsPending] = useState(false);
    const [globalError, setGlobalError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // const { permissions, loading: dataLoading } = useRoleData();
    // const permissionOptions = useMemo(() => transformPermissionsToOptions(permissions), [permissions]);
    const { permissionCategories, loading: dataLoading } = useRoleData();

    const form = useForm<UpdateRoleInput>({
        resolver: valibotResolver(updateRoleSchema),
        defaultValues: {
            name: "",
            description: "",
            permissions: [],
            active: true,
        },
    });

    useEffect(() => {
        if (open && roleId) {
            const fetchRoleData = async () => {
                setIsLoading(true);
                setGlobalError("");

                try {
                    const response = await getRoleById(roleId);
                    const roleData = response.data;

                    form.reset({
                        name: roleData?.name || "",
                        description: roleData?.description || "",
                        roleLevel: roleData?.roleLevel || 1,
                        permissions: roleData?.permissions || [],
                        active: roleData?.active ?? true,
                    });
                } catch (error: any) {
                    const errorMessage = handleApiFormErrors(error, form.setError);
                    if (errorMessage) {
                        setGlobalError(errorMessage);
                        toast.error(errorMessage);
                    }
                } finally {
                    setIsLoading(false);
                }
            };

            fetchRoleData();
        }
    }, [open, roleId, form]);

    const handleSubmit = async (data: UpdateRoleInput) => {
        setGlobalError("");
        setIsPending(true);

        try {
            const response = await updateRole(roleId, data);
            toast.success(response.message || "Role updated successfully");
            onOpenChange(false);
            onRoleUpdated?.();
        } catch (error: any) {
            const errorMessage = handleApiFormErrors(error, form.setError);
            if (errorMessage) {
                setGlobalError(errorMessage);
                toast.error(errorMessage);
            }
        } finally {
            setIsPending(false);
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        onOpenChange(isOpen);
        if (!isOpen) {
            setGlobalError("");
            setIsLoading(true);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-h-[90vh] w-full overflow-y-auto !max-w-[800px] sm:w-[95vw] md:w-[80vw] lg:w-[60vw]">
                <DialogHeader>
                    <DialogTitle>Update Role</DialogTitle>
                    <DialogDescription>
                        Edit role information and permissions.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <AlertMessage message={globalError} variant="error" />

                            <RoleDetailsForm
                                form={form as unknown as UseFormReturn<CreateRoleInput>}
                                permissionCategories={permissionCategories}
                                loading={dataLoading}
                            />

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    disabled={isPending}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Update Role
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
