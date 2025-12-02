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
import { createUser } from "@/lib/service/user.service";
import { createUserSchema, type CreateUserInput } from "@/lib/validation/user.schema";
import { handleApiFormErrors } from "@/lib/util/form-errors";
import { useUserData } from "@/lib/providers/user-data-provider";
import { transformToComboboxOptions } from "@/lib/utils/entity-transforms";
import { INITIAL_USER_FORM_VALUES } from "../../constants/form-defaults";
import { UserDetailsForm } from "../forms/UserDetailsForm";
import { AddressForm } from "../forms/AddressForm";

interface AddUserDialogProps {
    onUserCreated?: () => void;
    children?: React.ReactNode;
}

export default function AddUserDialog({ onUserCreated, children }: AddUserDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [globalError, setGlobalError] = useState("");

    // Use centralized data from context - NO redundant API calls!
    const { roles, vehicles, addressTypes, loading } = useUserData();

    // Transform data to combobox options
    const roleOptions = useMemo(() => transformToComboboxOptions(roles), [roles]);
    const vehicleOptions = useMemo(() => transformToComboboxOptions(vehicles.map(v => ({
        id: v.id,
        name: `${v.licensePlate} (${v.brand} ${v.model})`
    }))), [vehicles]);
    const addressTypeOptions = useMemo(() => addressTypes.map(at => ({
        value: at.name,
        label: at.description
    })), [addressTypes]);

    // Form setup
    const form = useForm<CreateUserInput>({
        resolver: valibotResolver(createUserSchema),
        defaultValues: INITIAL_USER_FORM_VALUES as CreateUserInput,
    });

    // Form submission handler
    const handleSubmit = async (data: CreateUserInput) => {
        setGlobalError("");
        setIsPending(true);

        try {
            const response = await createUser(data);
            toast.success(response.message);
            setOpen(false);
            form.reset();
            onUserCreated?.();
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
                            loading={loading}
                        />

                        {/* Address Section */}
                        <AddressForm
                            form={form}
                            addressTypeOptions={addressTypeOptions}
                            loading={loading}
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
