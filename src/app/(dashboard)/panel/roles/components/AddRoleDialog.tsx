"use client";

import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AlertMessage } from "@/components/ui/alert-message";
import { Loader2, Plus } from "lucide-react";

import { createRole } from "@/lib/service/role.services";
import { createRoleSchema, type CreateRoleInput } from "@/lib/validation/role.schema";
import { useRoleData } from "@/lib/providers/role-data-provider";
import { RoleDetailsForm } from "./forms/RoleDetailsForm";
import { INITIAL_ROLE_FORM_VALUES } from "../constants/form-defaults";
import { EntityDialog } from "@/components/shared/dialogs/EntityDialog";
import { useEntityForm } from "@/hooks/use-entity-form";

interface AddRoleDialogProps {
    onRoleCreated?: () => void;
    children?: React.ReactNode;
}

export default function AddRoleDialog({ onRoleCreated, children }: AddRoleDialogProps) {
    const { permissionCategories, loading } = useRoleData();

    const form = useForm<CreateRoleInput>({
        resolver: valibotResolver(createRoleSchema),
        defaultValues: INITIAL_ROLE_FORM_VALUES as CreateRoleInput,
    });

    const { handleSubmit, isPending, globalError } = useEntityForm({
        form,
        onSubmit: createRole,
        successMessage: "Role created successfully",
        onSuccess: onRoleCreated
    });

    return (
        <EntityDialog
            trigger={
                children || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Role
                    </Button>
                )
            }
            title="Add New Role"
            description="Create a new role with specific permissions."
            maxWidth="lg"
        >
            {({ onCancel }) => (
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
                                    onClick={onCancel}
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
            )}
        </EntityDialog>
    );
}
