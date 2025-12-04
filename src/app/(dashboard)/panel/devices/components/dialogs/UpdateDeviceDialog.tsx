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
import { getDeviceById, updateDevice } from "@/lib/service/device.service";
import { DeviceForm, DeviceFormValues } from "../forms/DeviceForm";
import { QUERY_KEYS } from "@/lib/hooks";
import { LoadingState } from "@/components/ui/loading-state";

interface UpdateDeviceDialogProps {
    deviceId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeviceUpdated?: () => void;
}

export default function UpdateDeviceDialog({
    deviceId,
    open,
    onOpenChange,
    onDeviceUpdated,
}: UpdateDeviceDialogProps) {
    const queryClient = useQueryClient();
    const [formValues, setFormValues] = useState<DeviceFormValues>({
        imei: "",
        deviceModel: "",
        firmwareVersion: "",
        simNumber: "",
        protocolType: "",
        simCategory: "",
        vehicleId: "",
    });
    const [errors, setErrors] = useState<Partial<Record<keyof DeviceFormValues, string>>>({});

    // Fetch device data
    const { data, isLoading } = useQuery({
        queryKey: [...QUERY_KEYS.devices, deviceId],
        queryFn: () => getDeviceById(deviceId),
        enabled: open && !!deviceId,
    });

    // Update form values when data is loaded
    useEffect(() => {
        if (data?.data) {
            setFormValues({
                imei: data.data.imei || "",
                deviceModel: data.data.deviceModel || "",
                firmwareVersion: data.data.firmwareVersion || "",
                simNumber: data.data.simNumber || "",
                protocolType: data.data.protocolType || "",
                simCategory: data.data.simCategory || "",
                vehicleId: data.data.vehicleId || "",
            });
        }
    }, [data]);

    const updateMutation = useMutation({
        mutationFn: (payload: any) => updateDevice(deviceId, payload),
        onSuccess: () => {
            toast.success("Device updated successfully");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.devices });
            onOpenChange(false);
            onDeviceUpdated?.();
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to update device");
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

        updateMutation.mutate({
            imei: formValues.imei,
            deviceModel: formValues.deviceModel,
            firmwareVersion: formValues.firmwareVersion,
            simNumber: formValues.simNumber,
            protocolType: formValues.protocolType,
            simCategory: formValues.simCategory,
            vehicleId: formValues.vehicleId || null,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Device</DialogTitle>
                    <DialogDescription>
                        Update device details. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <LoadingState message="Loading device..." />
                ) : (
                    <DeviceForm
                        values={formValues}
                        onChange={setFormValues}
                        errors={errors}
                        isUpdate
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
