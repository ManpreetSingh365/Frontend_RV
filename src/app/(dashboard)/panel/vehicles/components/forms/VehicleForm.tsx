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

// Vehicle form schema
export const vehicleFormSchema = z.object({
    licensePlate: z.string().min(1, "License plate is required"),
    brand: z.string().min(1, "Brand is required"),
    model: z.string().min(1, "Model is required"),
    year: z.number().min(1900).max(2100),
    vin: z.string().min(1, "VIN is required"),
    vehicleOwner: z.string().min(1, "Vehicle owner is required"),
    emergencyNumber: z.string().min(1, "Emergency number is required"),
    vehicleType: z.string().min(1, "Vehicle type is required"),
    deviceId: z.string().optional(),
    userIds: z.array(z.string()).optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
    values: VehicleFormValues;
    onChange: (values: VehicleFormValues) => void;
    errors?: Partial<Record<keyof VehicleFormValues, string>>;
    devices?: Array<{ id: string; imei: string }>;
    users?: Array<{ id: string; firstName: string; lastName: string }>;
}

export function VehicleForm({ values, onChange, errors, devices = [], users = [] }: VehicleFormProps) {
    const handleChange = (field: keyof VehicleFormValues, value: any) => {
        onChange({ ...values, [field]: value });
    };

    return (
        <div className="space-y-4">
            {/* License Plate */}
            <div className="space-y-2">
                <Label htmlFor="licensePlate">
                    License Plate <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="licensePlate"
                    value={values.licensePlate || ""}
                    onChange={(e) => handleChange("licensePlate", e.target.value)}
                    placeholder="PB02 0001"
                />
                {errors?.licensePlate && <p className="text-sm text-destructive">{errors.licensePlate}</p>}
            </div>

            {/* Brand */}
            <div className="space-y-2">
                <Label htmlFor="brand">
                    Brand <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="brand"
                    value={values.brand || ""}
                    onChange={(e) => handleChange("brand", e.target.value)}
                    placeholder="Yamaha"
                />
                {errors?.brand && <p className="text-sm text-destructive">{errors.brand}</p>}
            </div>

            {/* Model */}
            <div className="space-y-2">
                <Label htmlFor="model">
                    Model <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="model"
                    value={values.model || ""}
                    onChange={(e) => handleChange("model", e.target.value)}
                    placeholder="XSR-100"
                />
                {errors?.model && <p className="text-sm text-destructive">{errors.model}</p>}
            </div>

            {/* Year */}
            <div className="space-y-2">
                <Label htmlFor="year">
                    Year <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="year"
                    type="number"
                    value={values.year || ""}
                    onChange={(e) => handleChange("year", parseInt(e.target.value) || 0)}
                    placeholder="2025"
                />
                {errors?.year && <p className="text-sm text-destructive">{errors.year}</p>}
            </div>

            {/* VIN */}
            <div className="space-y-2">
                <Label htmlFor="vin">
                    VIN <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="vin"
                    value={values.vin || ""}
                    onChange={(e) => handleChange("vin", e.target.value)}
                    placeholder="MA3EYD32S00234567"
                />
                {errors?.vin && <p className="text-sm text-destructive">{errors.vin}</p>}
            </div>

            {/* Vehicle Type */}
            <div className="space-y-2">
                <Label htmlFor="vehicleType">
                    Vehicle Type <span className="text-destructive">*</span>
                </Label>
                <Select value={values.vehicleType || ""} onValueChange={(value) => handleChange("vehicleType", value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="CAR">Car</SelectItem>
                        <SelectItem value="MOTORCYCLE">Motorcycle</SelectItem>
                        <SelectItem value="TRUCK">Truck</SelectItem>
                        <SelectItem value="BUS">Bus</SelectItem>
                        <SelectItem value="VAN">Van</SelectItem>
                    </SelectContent>
                </Select>
                {errors?.vehicleType && <p className="text-sm text-destructive">{errors.vehicleType}</p>}
            </div>

            {/* Vehicle Owner */}
            <div className="space-y-2">
                <Label htmlFor="vehicleOwner">
                    Vehicle Owner <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="vehicleOwner"
                    value={values.vehicleOwner || ""}
                    onChange={(e) => handleChange("vehicleOwner", e.target.value)}
                    placeholder="John Doe"
                />
                {errors?.vehicleOwner && <p className="text-sm text-destructive">{errors.vehicleOwner}</p>}
            </div>

            {/* Emergency Number */}
            <div className="space-y-2">
                <Label htmlFor="emergencyNumber">
                    Emergency Number <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="emergencyNumber"
                    value={values.emergencyNumber || ""}
                    onChange={(e) => handleChange("emergencyNumber", e.target.value)}
                    placeholder="9592297120"
                />
                {errors?.emergencyNumber && <p className="text-sm text-destructive">{errors.emergencyNumber}</p>}
            </div>

            {/* Device */}
            <div className="space-y-2">
                <Label htmlFor="deviceId">Device</Label>
                <Select value={values.deviceId || undefined} onValueChange={(value) => handleChange("deviceId", value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select device (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                        {devices.map((device) => (
                            <SelectItem key={device.id} value={device.id}>
                                {device.imei}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
