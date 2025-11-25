"use client";

import { useState, useTransition, useMemo } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AlertMessage } from "@/components/ui/alert-message";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { createUser } from "@/lib/service/user.service";
import { createUserSchema, type CreateUserInput } from "@/lib/validation/user.schema";
import { useRoles } from "../hooks/use-roles";
import { useAddressTypes } from "../hooks/use-address-types";
import { useVehicles } from "../hooks/useVehicles";
import { UserDetailsForm } from "./forms/UserDetailsForm";
import { AddressForm } from "./forms/AddressForm";
import { transformRolesToOptions, transformVehiclesToOptions, transformAddressTypesToOptions } from "../utils/form-utils";
import { INITIAL_USER_FORM_VALUES } from "../constants/form-defaults";

interface AddUserDialogProps {
    onUserCreated?: () => void;
    children?: React.ReactNode;
}

export default function AddUserDialog({ onUserCreated, children }: AddUserDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [globalError, setGlobalError] = useState("");

    // Fetch data
    const { roles, loading: loadingRoles } = useRoles();
    const { vehicles, loading: loadingVehicles } = useVehicles();
    const { addressTypes, loading: loadingAddressTypes } = useAddressTypes();

    // Transform data to combobox options
    const roleOptions = useMemo(() => transformRolesToOptions(roles), [roles]);
    const vehicleOptions = useMemo(() => transformVehiclesToOptions(vehicles), [vehicles]);
    const addressTypeOptions = useMemo(() => transformAddressTypesToOptions(addressTypes), [addressTypes]);

    // Form setup
    const form = useForm<CreateUserInput>({
        resolver: valibotResolver(createUserSchema),
        defaultValues: INITIAL_USER_FORM_VALUES as CreateUserInput,
    });

    // Form submission handler
    const handleSubmit = async (data: CreateUserInput) => {
        setGlobalError("");

        startTransition(async () => {
            try {
                await createUser(data);
                toast.success("User created successfully!");
                setOpen(false);
                form.reset();
                onUserCreated?.();
            } catch (error: any) {
                const errorMessage = error.messages?.[0] || error.message || "Failed to create user";
                setGlobalError(errorMessage);
                toast.error(errorMessage);
            }
        });
    };

    // Dialog open/close handler
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
                        Add New User
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] w-full overflow-y-auto !max-w-[1200px] sm:w-[95vw] md:w-[80vw] lg:w-[60vw] xl:w-[50vw]">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                        Fill in the form below to create a new user account.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        {/* Global Error */}
                        <AlertMessage message={globalError} variant="error" />

                        {/* User Details Section */}
                        <UserDetailsForm
                            form={form}
                            roleOptions={roleOptions}
                            vehicleOptions={vehicleOptions}
                            loadingRoles={loadingRoles}
                            loadingVehicles={loadingVehicles}
                        />

                        {/* Address Section */}
                        <AddressForm
                            form={form}
                            addressTypeOptions={addressTypeOptions}
                            loadingAddressTypes={loadingAddressTypes}
                        />

                        {/* Form Actions */}
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
                                Create User
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
