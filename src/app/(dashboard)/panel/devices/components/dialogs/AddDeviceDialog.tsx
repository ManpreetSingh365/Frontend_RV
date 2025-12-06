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
import { Loader2, IndianRupee, Clock } from "lucide-react";
import { createDevice } from "@/lib/service/device.service";
import { DeviceForm, DeviceFormValues } from "../forms/DeviceForm";
import { QUERY_KEYS, useSubscriptionPlansQuery, useSimCategoriesQuery, useDeviceModelsQuery, useDeviceProtocolTypesQuery } from "@/lib/hooks";

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
    });
    const [errors, setErrors] = useState<Partial<Record<keyof DeviceFormValues, string>>>({});

    // Fetch dropdown data
    const { data: plansData } = useSubscriptionPlansQuery({ page: 1, size: 100 });
    const { data: simCategories = [] } = useSimCategoriesQuery();
    const { data: deviceModels = [] } = useDeviceModelsQuery();
    const { data: protocolTypes = [] } = useDeviceProtocolTypesQuery();
    const subscriptionPlans = plansData?.data?.map((plan: any) => {
        const details = [];

        if (plan.amount !== undefined)
            details.push(<><IndianRupee className="h-3 w-3" /> {plan.amount}</>);

        if (plan.durationDays)
            details.push(<><Clock className="h-3 w-3" /> {plan.durationDays} days</>);

        return {
            value: plan.id,
            label: plan.name,
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
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
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
                    deviceModels={deviceModels}
                    simCategories={simCategories}
                    protocolTypes={protocolTypes}
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
