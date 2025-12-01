"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AlertMessage } from "@/components/ui/alert-message";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { createRole } from "@/lib/service/role.services";
import { createRoleSchema, type CreateRoleInput } from "@/lib/validation/role.schema";
import { useRoleData } from "../providers/data-provider";
import { RoleDetailsForm } from "./forms/RoleDetailsForm";
import { INITIAL_ROLE_FORM_VALUES } from "../constants/form-defaults";
import { handleApiFormErrors } from "@/lib/util/form-errors";

interface AddRoleDialogProps {
    onRoleCreated?: () => void;
    children?: React.ReactNode;
}

export default function AddRoleDialog({ onRoleCreated, children }: AddRoleDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [globalError, setGlobalError] = useState("");

    // const { permissions, loading } = useRoleData();
    // const permissionOptions = useMemo(() => transformPermissionsToOptions(permissions), [permissions]);
    const { permissionCategories, loading } = useRoleData();

    const form = useForm<CreateRoleInput>({
        resolver: valibotResolver(createRoleSchema),
        defaultValues: INITIAL_ROLE_FORM_VALUES as CreateRoleInput,
    });

    const handleSubmit = async (data: CreateRoleInput) => {
        setGlobalError("");
        setIsPending(true);

        try {
            const response = await createRole(data);
            toast.success(response.message || "Role created successfully");
            setOpen(false);
            form.reset();
            onRoleCreated?.();
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
        setOpen(isOpen);
        if (!isOpen) {
            form.reset();
            setGlobalError("");
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Role
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] w-full overflow-y-auto !max-w-[800px] sm:w-[95vw] md:w-[80vw] lg:w-[60vw]">
                <DialogHeader>
                    <DialogTitle>Add New Role</DialogTitle>
                    <DialogDescription>
                        Create a new role with specific permissions.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <AlertMessage message={globalError} variant="error" />

                        <RoleDetailsForm
                            form={form}
                            permissionCategories={permissionCategories}
                            loading={loading}
                        >
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    disabled={isPending}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Role
                                </Button>
                            </div>
                        </RoleDetailsForm>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
