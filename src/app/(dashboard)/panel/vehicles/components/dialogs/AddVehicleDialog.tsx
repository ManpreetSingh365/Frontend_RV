"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createVehicle } from "@/lib/service/vehicle.service";
import { VehicleForm, VehicleFormValues } from "../forms/VehicleForm";
import { QUERY_KEYS, useDevicesQuery, useUsersQuery } from "@/lib/hooks";

interface AddVehicleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onVehicleCreated?: () => void;
}

export default function AddVehicleDialog({
    open,
    onOpenChange,
    onVehicleCreated,
}: AddVehicleDialogProps) {
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

    const createMutation = useMutation({
        mutationFn: createVehicle,
        onSuccess: () => {
            toast.success("Vehicle created successfully");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vehicles });
            onOpenChange(false);
            onVehicleCreated?.();
            // Reset form
            setFormValues({
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
            setErrors({});
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to create vehicle");
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

        createMutation.mutate({
            licensePlate: formValues.licensePlate,
            brand: formValues.brand,
            model: formValues.model,
            year: formValues.year,
            vin: formValues.vin,
            vehicleOwner: formValues.vehicleOwner,
            emergencyNumber: formValues.emergencyNumber,
            vehicleType: formValues.vehicleType,
            deviceId: formValues.deviceId || "",
            userIds: formValues.userIds || [],
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Register New Vehicle</DialogTitle>
                    <DialogDescription>
                        Register a new vehicle in the system. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <VehicleForm
                    values={formValues}
                    onChange={setFormValues}
                    errors={errors}
                    devices={devices}
                    users={users}
                />

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={createMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Registering..." : "Register Vehicle"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
