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
import { createDevice } from "@/lib/service/device.service";
import { DeviceForm, DeviceFormValues } from "../forms/DeviceForm";
import { QUERY_KEYS, useSubscriptionPlansQuery } from "@/lib/hooks";

interface AddDeviceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeviceCreated?: () => void;
}

export default function AddDeviceDialog({
    open,
    onOpenChange,
    onDeviceCreated,
}: AddDeviceDialogProps) {
    const queryClient = useQueryClient();
    const [formValues, setFormValues] = useState<DeviceFormValues>({
        imei: "",
        deviceModel: "",
        firmwareVersion: "",
        simNumber: "",
        protocolType: "",
        simCategory: "",
        subscriptionPlanId: "",
        paymentMethod: "",
    });
    const [errors, setErrors] = useState<Partial<Record<keyof DeviceFormValues, string>>>({});

    // Fetch subscription plans for dropdown
    const { data: plansData } = useSubscriptionPlansQuery({ page: 1, size: 100 });
    const subscriptionPlans = plansData?.data?.map((plan: any) => ({ id: plan.id, name: plan.name })) || [];

    const createMutation = useMutation({
        mutationFn: createDevice,
        onSuccess: () => {
            toast.success("Device created successfully");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.devices });
            onOpenChange(false);
            onDeviceCreated?.();
            // Reset form
            setFormValues({
                imei: "",
                deviceModel: "",
                firmwareVersion: "",
                simNumber: "",
                protocolType: "",
                simCategory: "",
                subscriptionPlanId: "",
                paymentMethod: "",
            });
            setErrors({});
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to create device");
        },
    });

    const handleSubmit = () => {
        // Basic validation
        const newErrors: Partial<Record<keyof DeviceFormValues, string>> = {};
        if (!formValues.imei) newErrors.imei = "IMEI is required";
        if (!formValues.deviceModel) newErrors.deviceModel = "Device model is required";
        if (!formValues.firmwareVersion) newErrors.firmwareVersion = "Firmware version is required";
        if (!formValues.simNumber) newErrors.simNumber = "SIM number is required";
        if (!formValues.protocolType) newErrors.protocolType = "Protocol type is required";
        if (!formValues.simCategory) newErrors.simCategory = "SIM category is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        createMutation.mutate({
            imei: formValues.imei,
            deviceModel: formValues.deviceModel,
            firmwareVersion: formValues.firmwareVersion,
            simNumber: formValues.simNumber,
            protocolType: formValues.protocolType,
            simCategory: formValues.simCategory,
            subscriptionPlanId: formValues.subscriptionPlanId || "",
            paymentMethod: formValues.paymentMethod || "",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Register New Device</DialogTitle>
                    <DialogDescription>
                        Register a new GPS device. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <DeviceForm
                    values={formValues}
                    onChange={setFormValues}
                    errors={errors}
                    subscriptionPlans={subscriptionPlans}
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
                        {createMutation.isPending ? "Registering..." : "Register Device"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
