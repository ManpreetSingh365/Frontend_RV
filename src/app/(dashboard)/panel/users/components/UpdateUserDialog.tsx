"use client";

import { useState, useMemo, useEffect } from "react";
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
import { handleApiFormErrors } from "@/lib/util/form-errors";

interface UpdateUserDialogProps {
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUserUpdated?: () => void;
}

export default function UpdateUserDialog({ userId, open, onOpenChange, onUserUpdated }: UpdateUserDialogProps) {
    const [isPending, setIsPending] = useState(false);
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
            const fetchUserData = async () => {
                setIsLoading(true);
                setGlobalError("");

                try {
                    const response = await getUserById(userId);
                    const userData = response.data;

                    // Find role ID from role name
                    const userRoleId = roles.find(r => r.name === userData?.role)?.id || "";

                    // Prefill form with existing data
                    form.reset({
                        email: userData?.email || "",
                        firstName: userData?.firstName || "",
                        lastName: userData?.lastName || "",
                        phoneNumber: userData?.phoneNumber || "",
                        roleId: userRoleId,
                        vehicleIds: userData?.vehiclesIds || [],
                        addresses: userData?.addresses?.length ? userData.addresses : [{
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
                    const errorMessage = handleApiFormErrors(error, form.setError);
                    if (errorMessage) {
                        setGlobalError(errorMessage);
                        toast.error(errorMessage);
                    }
                } finally {
                    setIsLoading(false);
                }
            };

            fetchUserData();
        }
    }, [open, userId, form, roles]);

    // Form submission handler
    const handleSubmit = async (data: UpdateUserInput) => {
        setGlobalError("");
        setIsPending(true);

        try {
            const response = await updateUser(userId, data);
            const successMessage = response.message;
            toast.success(successMessage);
            onOpenChange(false);
            onUserUpdated?.();
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
