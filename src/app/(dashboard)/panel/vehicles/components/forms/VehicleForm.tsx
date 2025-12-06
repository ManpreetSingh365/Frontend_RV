"use client";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldRow } from "@/components/ui/form/index";
import { SearchableCombobox, type ComboboxOption } from "@/components/ui/searchable-combobox";
import { MultiSelectField } from "@/components/ui/form/index";

// Vehicle form schema
export const vehicleFormSchema = z.object({
    licensePlate: z.string().min(1, "License plate is required"),
    brand: z.string().min(1, "Brand is required"),
    model: z.string().optional(),
    year: z.number().min(1900).optional(),
    vin: z.string().optional(),
    vehicleOwner: z.string().optional(),
    emergencyNumber: z.string().optional(),
    vehicleType: z.string().min(1, "Vehicle type is required"),
    deviceId: z.string().optional(),
    userIds: z.array(z.string()).optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
    values: VehicleFormValues;
    onChange: (values: VehicleFormValues) => void;
    errors?: Partial<Record<keyof VehicleFormValues, string>>;
    deviceOptions?: ComboboxOption[];
    userOptions?: ComboboxOption[];
    vehicleTypes?: ComboboxOption[];
    loading?: boolean;
}

export function VehicleForm({
    values,
    onChange,
    errors,
    deviceOptions = [],
    userOptions = [],
    vehicleTypes = [],
    loading = false
}: VehicleFormProps) {
    const handleChange = (field: keyof VehicleFormValues, value: any) => {
        onChange({ ...values, [field]: value });
    };

    return (
        <div className="space-y-6">
            {/* Section 1: Vehicle Details */}
            <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                    <h3 className="text-lg font-semibold">Vehicle Details</h3>
                </div>

                <FieldRow>
                    {/* License Plate */}
                    <div className="space-y-2">
                        <Label htmlFor="licensePlate">
                            License Plate <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="licensePlate"
                            value={values.licensePlate || ""}
                            onChange={(e) => handleChange("licensePlate", e.target.value)}
                            placeholder="PB02 0001"
                        />
                        {errors?.licensePlate && <p className="text-sm text-destructive">{errors.licensePlate}</p>}
                    </div>

                    {/* VIN */}
                    <div className="space-y-2">
                        <Label htmlFor="vin">
                            VIN
                        </Label>
                        <Input
                            id="vin"
                            value={values.vin || ""}
                            onChange={(e) => handleChange("vin", e.target.value)}
                            placeholder="MA3EYD32S00234567"
                        />
                        {errors?.vin && <p className="text-sm text-destructive">{errors.vin}</p>}
                    </div>
                </FieldRow>

                <FieldRow>
                    {/* Brand */}
                    <div className="space-y-2">
                        <Label htmlFor="brand">
                            Brand <span className="text-red-500">*</span>
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
                            Model
                        </Label>
                        <Input
                            id="model"
                            value={values.model || ""}
                            onChange={(e) => handleChange("model", e.target.value)}
                            placeholder="XSR-100"
                        />
                        {errors?.model && <p className="text-sm text-destructive">{errors.model}</p>}
                    </div>
                </FieldRow>

                <FieldRow>
                    {/* Year */}
                    <div className="space-y-2">
                        <Label htmlFor="year">
                            Year
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

                    {/* Vehicle Type */}
                    <div className="space-y-2">
                        <Label htmlFor="vehicleType">
                            Vehicle Type <span className="text-red-500">*</span>
                        </Label>
                        <SearchableCombobox
                            value={values.vehicleType || ""}
                            onChange={(value) => handleChange("vehicleType", value)}
                            options={vehicleTypes}
                            loading={loading}
                            placeholder="Select vehicle type"
                            searchPlaceholder="Search vehicle types..."
                            emptyMessage="No vehicle types found"
                        />
                        {errors?.vehicleType && <p className="text-sm text-destructive">{errors.vehicleType}</p>}
                    </div>
                </FieldRow>
            </div>

            {/* Section 2: Owner Information */}
            <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                    <h3 className="text-lg font-semibold">Owner Information</h3>
                </div>

                <FieldRow>
                    {/* Vehicle Owner */}
                    <div className="space-y-2">
                        <Label htmlFor="vehicleOwner">
                            Vehicle Owner
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
                            Emergency Number
                        </Label>
                        <Input
                            id="emergencyNumber"
                            value={values.emergencyNumber || ""}
                            onChange={(e) => handleChange("emergencyNumber", e.target.value)}
                            placeholder="+919592297120"
                        />
                        {errors?.emergencyNumber && <p className="text-sm text-destructive">{errors.emergencyNumber}</p>}
                    </div>
                </FieldRow>
            </div>

            {/* Section 3: Device & User Assignment */}
            <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                    <h3 className="text-lg font-semibold">Device & User Assignment</h3>
                </div>

                <FieldRow>
                    {/* Assign Device */}
                    <div className="space-y-2">
                        <Label htmlFor="deviceId">Assign Device</Label>
                        <SearchableCombobox
                            value={values.deviceId || ""}
                            onChange={(value) => handleChange("deviceId", value)}
                            options={deviceOptions}
                            loading={loading}
                            placeholder="Select device"
                            searchPlaceholder="Search devices..."
                            emptyMessage="No devices found"
                        />
                    </div>

                    {/* Assign Users */}
                    <div className="space-y-2">
                        <Label htmlFor="userIds">Assign Users</Label>
                        <MultiSelectField
                            value={values.userIds || []}
                            onChange={(value) => handleChange("userIds", value)}
                            options={userOptions}
                            loading={loading}
                            placeholder="Select users"
                            searchPlaceholder="Search users..."
                            emptyMessage="No users found"
                        />
                    </div>
                </FieldRow>
            </div>
        </div>
    );
}
