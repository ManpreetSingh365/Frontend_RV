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

// Device form schema
export const deviceFormSchema = z.object({
    imei: z.string().min(1, "IMEI is required"),
    deviceModel: z.string().min(1, "Device model is required"),
    firmwareVersion: z.string().min(1, "Firmware version is required"),
    simNumber: z.string().min(1, "SIM number is required"),
    protocolType: z.string().min(1, "Protocol type is required"),
    simCategory: z.string().min(1, "SIM category is required"),
    subscriptionPlanId: z.string().optional(),
    paymentMethod: z.string().optional(),
    vehicleId: z.string().optional(),
});

export type DeviceFormValues = z.infer<typeof deviceFormSchema>;

interface DeviceFormProps {
    values: DeviceFormValues;
    onChange: (values: DeviceFormValues) => void;
    errors?: Partial<Record<keyof DeviceFormValues, string>>;
    isUpdate?: boolean;
    subscriptionPlans?: Array<{ id: string; name: string }>;
}

export function DeviceForm({ values, onChange, errors, isUpdate = false, subscriptionPlans = [] }: DeviceFormProps) {
    const handleChange = (field: keyof DeviceFormValues, value: any) => {
        onChange({ ...values, [field]: value });
    };

    return (
        <div className="space-y-4">
            {/* IMEI */}
            <div className="space-y-2">
                <Label htmlFor="imei">
                    IMEI <span className="text-destructive">*</span>
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
                    Device Model <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="deviceModel"
                    value={values.deviceModel || ""}
                    onChange={(e) => handleChange("deviceModel", e.target.value)}
                    placeholder="V5"
                />
                {errors?.deviceModel && <p className="text-sm text-destructive">{errors.deviceModel}</p>}
            </div>

            {/* Firmware Version */}
            <div className="space-y-2">
                <Label htmlFor="firmwareVersion">
                    Firmware Version <span className="text-destructive">*</span>
                </Label>
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
                <Label htmlFor="simNumber">
                    SIM Number <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="simNumber"
                    value={values.simNumber || ""}
                    onChange={(e) => handleChange("simNumber", e.target.value)}
                    placeholder="98765432109876540000"
                />
                {errors?.simNumber && <p className="text-sm text-destructive">{errors.simNumber}</p>}
            </div>

            {/* Protocol Type */}
            <div className="space-y-2">
                <Label htmlFor="protocolType">
                    Protocol Type <span className="text-destructive">*</span>
                </Label>
                <Select value={values.protocolType || ""} onValueChange={(value) => handleChange("protocolType", value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select protocol" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="GT06">GT06</SelectItem>
                        <SelectItem value="TK103">TK103</SelectItem>
                        <SelectItem value="H02">H02</SelectItem>
                    </SelectContent>
                </Select>
                {errors?.protocolType && <p className="text-sm text-destructive">{errors.protocolType}</p>}
            </div>

            {/* SIM Category */}
            <div className="space-y-2">
                <Label htmlFor="simCategory">
                    SIM Provider <span className="text-destructive">*</span>
                </Label>
                <Select value={values.simCategory || ""} onValueChange={(value) => handleChange("simCategory", value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="AIRTEL">AIRTEL</SelectItem>
                        <SelectItem value="JIO">JIO</SelectItem>
                        <SelectItem value="VODAFONE">VODAFONE</SelectItem>
                        <SelectItem value="BSNL">BSNL</SelectItem>
                    </SelectContent>
                </Select>
                {errors?.simCategory && <p className="text-sm text-destructive">{errors.simCategory}</p>}
            </div>

            {/* Subscription Plan (only for create) */}
            {!isUpdate && (
                <div className="space-y-2">
                    <Label htmlFor="subscriptionPlanId">Subscription Plan</Label>
                    <Select value={values.subscriptionPlanId || ""} onValueChange={(value) => handleChange("subscriptionPlanId", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                            {subscriptionPlans.map((plan) => (
                                <SelectItem key={plan.id} value={plan.id}>
                                    {plan.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Payment Method (only for create) */}
            {!isUpdate && (
                <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select value={values.paymentMethod || ""} onValueChange={(value) => handleChange("paymentMethod", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="RAZORPAY">Razorpay</SelectItem>
                            <SelectItem value="STRIPE">Stripe</SelectItem>
                            <SelectItem value="MANUAL">Manual</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
}
