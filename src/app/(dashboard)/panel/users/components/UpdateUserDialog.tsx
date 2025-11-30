"use client";

import { useState, useTransition, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AlertMessage } from "@/components/ui/alert-message";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getUserById, updateUser, type User } from "@/lib/service/user.service";
import { updateUserSchema, type UpdateUserInput } from "@/lib/validation/user.schema";
import { useUserData } from "../providers/data-provider";
import { UpdateUserDetailsForm } from "./forms/UpdateUserDetailsForm";
import { AddressForm } from "./forms/AddressForm";
import { transformRolesToOptions, transformVehiclesToOptions, transformAddressTypesToOptions } from "../utils/form-utils";

interface UpdateUserDialogProps {
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUserUpdated?: () => void;
}

export default function UpdateUserDialog({ userId, open, onOpenChange, onUserUpdated }: UpdateUserDialogProps) {
    const [isPending, startTransition] = useTransition();
    const [globalError, setGlobalError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Use centralized data from context - NO redundant API calls!
    const { roles, vehicles, addressTypes, loading: dataLoading } = useUserData();

    // Transform data to combobox options
    const roleOptions = useMemo(() => transformRolesToOptions(roles), [roles]);
    const vehicleOptions = useMemo(() => transformVehiclesToOptions(vehicles), [vehicles]);
    const addressTypeOptions = useMemo(() => transformAddressTypesToOptions(addressTypes), [addressTypes]);

    // Form setup
    const form = useForm<UpdateUserInput>({
        resolver: valibotResolver(updateUserSchema),
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            roleId: "",
            vehicleIds: [],
            addresses: [{
                streetLine1: "",
                streetLine2: "",
                city: "",
                state: "",
                postalCode: "",
                country: "India",
                landmark: "",
                addressType: "HOME",
                primaryAddress: true,
            }],
        },
    });

    // Fetch user data and prefill form
    useEffect(() => {
        if (open && userId) {
            setIsLoading(true);
            setGlobalError("");

            startTransition(async () => {
                try {
                    const userData = await getUserById(userId);

                    // Find role ID from role name
                    const userRoleId = roles.find(r => r.name === userData.role)?.id || "";

                    // Prefill form with existing data
                    form.reset({
                        email: userData.email || "",
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        phoneNumber: userData.phoneNumber,
                        roleId: userRoleId,
                        vehicleIds: userData.vehiclesIds || [],
                        addresses: userData.addresses?.length > 0 ? userData.addresses : [{
                            streetLine1: "",
                            streetLine2: "",
                            city: "",
                            state: "",
                            postalCode: "",
                            country: "India",
                            landmark: "",
                            addressType: "HOME",
                            primaryAddress: true,
                        }],
                    });
                } catch (error: any) {
                    const errorMessage = error.messages?.[0] || error.message || "Failed to load user data";
                    setGlobalError(errorMessage);
                    toast.error(errorMessage);
                } finally {
                    setIsLoading(false);
                }
            });
        }
    }, [open, userId, form, roles]);

    // Form submission handler
    const handleSubmit = async (data: UpdateUserInput) => {
        setGlobalError("");

        startTransition(async () => {
            try {
                await updateUser(userId, data);
                toast.success("User updated successfully!");
                onOpenChange(false);
                onUserUpdated?.();
            } catch (error: any) {
                const errorMessage = error.messages?.[0] || error.message || "Failed to update user";
                setGlobalError(errorMessage);
                toast.error(errorMessage);
            }
        });
    };

    // Dialog close handler
    const handleOpenChange = (isOpen: boolean) => {
        onOpenChange(isOpen);
        if (!isOpen) {
            setGlobalError("");
            setIsLoading(true);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-h-[90vh] w-full overflow-y-auto !max-w-[1200px] sm:w-[95vw] md:w-[80vw] lg:w-[60vw] xl:w-[50vw]">
                <DialogHeader>
                    <DialogTitle>Update User</DialogTitle>
                    <DialogDescription>
                        Edit user information and save changes.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            {/* Global Error */}
                            <AlertMessage message={globalError} variant="error" />

                            {/* User Details Section */}
                            <UpdateUserDetailsForm
                                form={form}
                                roleOptions={roleOptions}
                                vehicleOptions={vehicleOptions}
                                loading={dataLoading}
                            />

                            {/* Address Section */}
                            <AddressForm
                                form={form}
                                addressTypeOptions={addressTypeOptions}
                                loading={dataLoading}
                            />

                            {/* Form Actions */}
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
                                    Update User
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
