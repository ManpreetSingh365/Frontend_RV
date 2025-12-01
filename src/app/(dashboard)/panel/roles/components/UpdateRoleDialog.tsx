"use client";

import { useState, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AlertMessage } from "@/components/ui/alert-message";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getRoleById, updateRole } from "@/lib/service/role.services";
import { updateRoleSchema, type UpdateRoleInput, type CreateRoleInput } from "@/lib/validation/role.schema";
import { RoleDetailsForm } from "./forms/RoleDetailsForm";
import { EntityDialog } from "@/components/shared/dialogs/EntityDialog";
import { useEntityForm } from "@/hooks/use-entity-form";
import { handleApiFormErrors } from "@/lib/util/form-errors";
import { useRoleData } from "@/lib/providers/role-data-provider";

interface UpdateRoleDialogProps {
    roleId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRoleUpdated?: () => void;
}

export default function UpdateRoleDialog({ roleId, open, onOpenChange, onRoleUpdated }: UpdateRoleDialogProps) {
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

    const { handleSubmit, isPending, globalError, setGlobalError } = useEntityForm({
        form,
        onSubmit: (data) => updateRole(roleId, data),
        successMessage: "Role updated successfully",
        onSuccess: () => {
            onOpenChange(false);
            onRoleUpdated?.();
        }
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
    }, [open, roleId, form, setGlobalError]);

    const handleDialogClose = () => {
        onOpenChange(false);
        setGlobalError("");
        setIsLoading(true);
    };

    return (
        <EntityDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Update Role"
            description="Edit role information and permissions."
            maxWidth="lg"
        >
            {({ onCancel }) => (
                <>
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
                                >
                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleDialogClose}
                                            disabled={isPending}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isPending}>
                                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Update Role
                                        </Button>
                                    </div>
                                </RoleDetailsForm>
                            </form>
                        </Form>
                    )}
                </>
            )}
        </EntityDialog>
    );
}
