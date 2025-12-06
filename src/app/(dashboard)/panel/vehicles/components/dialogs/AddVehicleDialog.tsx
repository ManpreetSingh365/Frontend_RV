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
import { QUERY_KEYS, useDevicesQuery, useUsersQuery, useVehicleTypesQuery } from "@/lib/hooks";
import { Smartphone, Signal, Calendar, Timer, AtSign, Shield, Phone } from "lucide-react";

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
    const deviceOptions = devicesData?.data?.map((device: any) => {
        const details = [];

        if (device.deviceModel)
            details.push(<><Smartphone className="h-3 w-3" /> {device.deviceModel}</>);

        if (device.simCategory)
            details.push(<><Signal className="h-3 w-3" /> {device.simCategory}</>);

        if (device.createdAt)
            details.push(<><Calendar className="h-3 w-3" /> {new Date(device.createdAt).toLocaleDateString()}</>);

        if (device.expiryAt)
            details.push(<><Timer className="h-3 w-3" /> {new Date(device.expiryAt).toLocaleDateString()}</>);

        return {
            value: device.id,
            label: device.imei,
            description: details.length > 0 ? (
                <div className="flex items-center gap-2 flex-wrap">
                    {details.map((detail, index) => (
                        <span key={index} className="flex items-center gap-1">
                            {detail}
                        </span>
                    ))}
                </div>
            ) : undefined
        };
    }) || [];

    // Fetch users for dropdown
    const { data: usersData } = useUsersQuery({ page: 1, size: 100 });
    const userOptions = usersData?.data?.map((user: any) => {
        const details = [];

        if (user.username)
            details.push(<><AtSign className="h-3 w-3" /> {user.username}</>);

        if (user.role)
            details.push(<><Shield className="h-3 w-3" /> {user.role}</>);

        if (user.phoneNumber)
            details.push(<><Phone className="h-3 w-3" /> {user.phoneNumber}</>);

        return {
            value: user.id,
            label: `${user.firstName} ${user.lastName}`,
            description: details.length > 0 ? (
                <div className="flex items-center gap-2 flex-wrap">
                    {details.map((detail, index) => (
                        <span key={index} className="flex items-center gap-1">
                            {detail}
                        </span>
                    ))}
                </div>
            ) : undefined
        };
    }) || [];

    // Fetch vehicle types for dropdown
    const { data: vehicleTypes = [], isLoading: vehicleTypesLoading } = useVehicleTypesQuery();

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
            <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
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
                    deviceOptions={deviceOptions}
                    userOptions={userOptions}
                    vehicleTypes={vehicleTypes}
                    loading={vehicleTypesLoading}
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
