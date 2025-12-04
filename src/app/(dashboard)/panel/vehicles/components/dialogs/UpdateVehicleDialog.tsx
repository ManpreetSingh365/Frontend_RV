"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getVehicleById, updateVehicle } from "@/lib/service/vehicle.service";
import { VehicleForm, VehicleFormValues } from "../forms/VehicleForm";
import { QUERY_KEYS, useDevicesQuery, useUsersQuery } from "@/lib/hooks";
import { LoadingState } from "@/components/ui/loading-state";

interface UpdateVehicleDialogProps {
    vehicleId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onVehicleUpdated?: () => void;
}

export default function UpdateVehicleDialog({
    vehicleId,
    open,
    onOpenChange,
    onVehicleUpdated,
}: UpdateVehicleDialogProps) {
    const queryClient = useQueryClient();
    const [formValues, setFormValues] = useState<VehicleFormValues>({
        licensePlate: "",
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        vin: "",
        vehicleOwner: "",
        emergencyNumber: "",
        vehicleType: "",
        deviceId: "",
        userIds: [],
    });
    const [errors, setErrors] = useState<Partial<Record<keyof VehicleFormValues, string>>>({});

    // Fetch vehicle data
    const { data, isLoading } = useQuery({
        queryKey: [...QUERY_KEYS.vehicles, vehicleId],
        queryFn: () => getVehicleById(vehicleId),
        enabled: open && !!vehicleId,
    });

    // Fetch devices for dropdown
    const { data: devicesData } = useDevicesQuery({ page: 1, size: 100 });
    const devices = devicesData?.data?.map((device: any) => ({ id: device.id, imei: device.imei })) || [];

    // Fetch users for dropdown
    const { data: usersData } = useUsersQuery({ page: 1, size: 100 });
    const users = usersData?.data?.map((user: any) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName
    })) || [];

    // Update form values when data is loaded
    useEffect(() => {
        if (data?.data) {
            setFormValues({
                licensePlate: data.data.licensePlate || "",
                brand: data.data.brand || "",
                model: data.data.model || "",
                year: data.data.year || new Date().getFullYear(),
                vin: data.data.vin || "",
                vehicleOwner: data.data.vehicleOwner || "",
                emergencyNumber: data.data.emergencyNumber || "",
                vehicleType: data.data.vehicleType || "",
                deviceId: data.data.deviceId || "",
                userIds: data.data.userIds || [],
            });
        }
    }, [data]);

    const updateMutation = useMutation({
        mutationFn: (payload: any) => updateVehicle(vehicleId, payload),
        onSuccess: () => {
            toast.success("Vehicle updated successfully");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vehicles });
            onOpenChange(false);
            onVehicleUpdated?.();
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to update vehicle");
        },
    });

    const handleSubmit = () => {
        // Basic validation
        const newErrors: Partial<Record<keyof VehicleFormValues, string>> = {};
        if (!formValues.licensePlate) newErrors.licensePlate = "License plate is required";
        if (!formValues.brand) newErrors.brand = "Brand is required";
        if (!formValues.model) newErrors.model = "Model is required";
        if (!formValues.year || formValues.year < 1900) newErrors.year = "Valid year is required";
        if (!formValues.vin) newErrors.vin = "VIN is required";
        if (!formValues.vehicleOwner) newErrors.vehicleOwner = "Vehicle owner is required";
        if (!formValues.emergencyNumber) newErrors.emergencyNumber = "Emergency number is required";
        if (!formValues.vehicleType) newErrors.vehicleType = "Vehicle type is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        updateMutation.mutate({
            licensePlate: formValues.licensePlate,
            brand: formValues.brand,
            model: formValues.model,
            year: formValues.year,
            vin: formValues.vin,
            vehicleOwner: formValues.vehicleOwner,
            emergencyNumber: formValues.emergencyNumber,
            vehicleType: formValues.vehicleType,
            deviceId: formValues.deviceId || null,
            userIds: formValues.userIds || [],
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Vehicle</DialogTitle>
                    <DialogDescription>
                        Update vehicle details. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <LoadingState message="Loading vehicle..." />
                ) : (
                    <VehicleForm
                        values={formValues}
                        onChange={setFormValues}
                        errors={errors}
                        devices={devices}
                        users={users}
                    />
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={updateMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={updateMutation.isPending || isLoading}>
                        {updateMutation.isPending ? "Updating..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
