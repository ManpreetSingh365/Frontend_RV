"use client";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SearchableCombobox, type ComboboxOption } from "@/components/ui/searchable-combobox";
import { FieldRow } from "@/components/ui/form/index";

// Device form schema
export const deviceFormSchema = z.object({
    imei: z.string().min(1, "IMEI is required"),
    deviceModel: z.string().min(1, "Device model is required"),
    firmwareVersion: z.string().optional(),
    simNumber: z.string().optional(),
    protocolType: z.string().min(1, "Protocol type is required"),
    simCategory: z.string().min(1, "SIM category is required"),
    subscriptionPlanId: z.string().optional(),
    vehicleId: z.string().optional(),
});

export type DeviceFormValues = z.infer<typeof deviceFormSchema>;

interface DeviceFormProps {
    values: DeviceFormValues;
    onChange: (values: DeviceFormValues) => void;
    errors?: Partial<Record<keyof DeviceFormValues, string>>;
    isUpdate?: boolean;
    subscriptionPlans?: ComboboxOption[];
    deviceModels?: string[];
    simCategories?: string[];
    protocolTypes?: string[];
}

export function DeviceForm({
    values,
    onChange,
    errors,
    isUpdate = false,
    subscriptionPlans = [],
    deviceModels = [],
    simCategories = [],
    protocolTypes = []
}: DeviceFormProps) {
    const handleChange = (field: keyof DeviceFormValues, value: any) => {
        onChange({ ...values, [field]: value });
    };

    return (
        <div className="space-y-6">
            {/* Section 1: Device Information */}
            <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                    <h3 className="text-lg font-semibold">Device Information</h3>
                </div>

                <FieldRow>
                    {/* IMEI */}
                    <div className="space-y-2">
                        <Label htmlFor="imei">
                            IMEI <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="imei"
                            value={values.imei || ""}
                            onChange={(e) => handleChange("imei", e.target.value)}
                            placeholder="356789123456789"
                        />
                        {errors?.imei && <p className="text-sm text-destructive">{errors.imei}</p>}
                    </div>

                    {/* Device Model */}
                    <div className="space-y-2">
                        <Label htmlFor="deviceModel">
                            Device Model <span className="text-red-500">*</span>
                        </Label>
                        <Select value={values.deviceModel || ""} onValueChange={(value) => handleChange("deviceModel", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select device model" />
                            </SelectTrigger>
                            <SelectContent>
                                {deviceModels.length > 0 ? (
                                    deviceModels.map((model) => (
                                        <SelectItem key={model} value={model}>
                                            {model}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="loading" disabled>
                                        Loading models...
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        {errors?.deviceModel && <p className="text-sm text-destructive">{errors.deviceModel}</p>}
                    </div>
                </FieldRow>

                <FieldRow>
                    {/* Firmware Version */}
                    <div className="space-y-2">
                        <Label>Firmware Version</Label>
                        <Input
                            id="firmwareVersion"
                            value={values.firmwareVersion || ""}
                            onChange={(e) => handleChange("firmwareVersion", e.target.value)}
                            placeholder="V-1.0.3"
                        />
                        {errors?.firmwareVersion && <p className="text-sm text-destructive">{errors.firmwareVersion}</p>}
                    </div>

                    {/* SIM Number */}
                    <div className="space-y-2">
                        <Label>SIM Number</Label>
                        <Input
                            id="simNumber"
                            value={values.simNumber || ""}
                            onChange={(e) => handleChange("simNumber", e.target.value)}
                            placeholder="98765432109876540000"
                        />
                        {errors?.simNumber && <p className="text-sm text-destructive">{errors.simNumber}</p>}
                    </div>
                </FieldRow>
            </div>

            {/* Section 2: Network Configuration */}
            <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                    <h3 className="text-lg font-semibold">Network Configuration</h3>
                </div>

                <FieldRow>
                    {/* Protocol Type */}
                    <div className="space-y-2">
                        <Label htmlFor="protocolType">
                            Protocol Type <span className="text-red-500">*</span>
                        </Label>
                        <Select value={values.protocolType || ""} onValueChange={(value) => handleChange("protocolType", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select protocol" />
                            </SelectTrigger>
                            <SelectContent>
                                {protocolTypes.length > 0 ? (
                                    protocolTypes.map((protocol) => (
                                        <SelectItem key={protocol} value={protocol}>
                                            {protocol}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="loading" disabled>
                                        Loading protocols...
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        {errors?.protocolType && <p className="text-sm text-destructive">{errors.protocolType}</p>}
                    </div>

                    {/* SIM Provider */}
                    <div className="space-y-2">
                        <Label htmlFor="simCategory">
                            SIM Provider <span className="text-red-500">*</span>
                        </Label>
                        <Select value={values.simCategory || ""} onValueChange={(value) => handleChange("simCategory", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                                {simCategories.length > 0 ? (
                                    simCategories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="loading" disabled>
                                        Loading providers...
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        {errors?.simCategory && <p className="text-sm text-destructive">{errors.simCategory}</p>}
                    </div>
                </FieldRow>
            </div>

            {/* Section 3: Subscription Plan (only for create) */}
            {!isUpdate && subscriptionPlans.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b">
                        <h3 className="text-lg font-semibold">Subscription</h3>
                    </div>

                    <div className="space-y-2 max-w-md">
                        <Label>Subscription Plan</Label>
                        <SearchableCombobox
                            value={values.subscriptionPlanId || ""}
                            onChange={(value) => handleChange("subscriptionPlanId", value)}
                            options={subscriptionPlans}
                            placeholder="Select plan"
                            searchPlaceholder="Search plans..."
                            emptyMessage="No plans found"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
