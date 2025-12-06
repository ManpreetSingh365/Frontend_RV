"use client";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { IndianRupee, X } from "lucide-react";
import { useState } from "react";

// Subscription Plan form schema
export const subscriptionPlanFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    amount: z.number().min(0, "Amount must be positive"),
    durationDays: z.number().min(1, "Duration must be at least 1 day"),
    features: z.array(z.string()),
    active: z.boolean().optional(),
});

export type SubscriptionPlanFormValues = z.infer<typeof subscriptionPlanFormSchema>;

interface SubscriptionPlanFormProps {
    values: SubscriptionPlanFormValues;
    onChange: (values: SubscriptionPlanFormValues) => void;
    errors?: Partial<Record<keyof SubscriptionPlanFormValues, string>>;
    showActiveToggle?: boolean;
}

export function SubscriptionPlanForm({ values, onChange, errors, showActiveToggle = false }: SubscriptionPlanFormProps) {
    const [newFeature, setNewFeature] = useState("");

    const handleChange = (field: keyof SubscriptionPlanFormValues, value: any) => {
        onChange({ ...values, [field]: value });
    };

    const addFeature = () => {
        if (newFeature.trim()) {
            handleChange("features", [...(values.features || []), newFeature.trim()]);
            setNewFeature("");
        }
    };

    const removeFeature = (index: number) => {
        const newFeatures = [...(values.features || [])];
        newFeatures.splice(index, 1);
        handleChange("features", newFeatures);
    };

    return (
        <div className="space-y-6">
            {/* Section 1: Basic Information */}
            <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                </div>

                {/* Plan Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">
                        Plan Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="name"
                        value={values.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Enter plan name"
                    />
                    {errors?.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                {/* Amount and Duration in Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="amount" className="flex items-center gap-1.5">
                            Amount <IndianRupee className="h-3.5 w-3.5" /> <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            value={values.amount || ""}
                            onChange={(e) => handleChange("amount", parseFloat(e.target.value) || 0)}
                            placeholder="999"
                        />
                        {errors?.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
                    </div>

                    {/* Duration Days */}
                    <div className="space-y-2">
                        <Label htmlFor="durationDays">
                            Duration (Days) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="durationDays"
                            type="number"
                            value={values.durationDays || ""}
                            onChange={(e) => handleChange("durationDays", parseInt(e.target.value) || 0)}
                            placeholder="30"
                        />
                        {errors?.durationDays && <p className="text-sm text-destructive">{errors.durationDays}</p>}
                    </div>
                </div>
            </div>

            {/* Section 2: Features */}
            <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                    <h3 className="text-lg font-semibold">Features</h3>
                </div>

                <div className="space-y-3">
                    <div className="flex gap-2">
                        <Input
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            placeholder="Add a feature (e.g., GPS Tracking, Real-time Alerts)"
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                        />
                        <Button type="button" onClick={addFeature} size="sm" className="shrink-0">
                            Add
                        </Button>
                    </div>
                    {values.features && values.features.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {values.features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md text-sm font-medium"
                                >
                                    <span>{feature}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(index)}
                                        className="hover:text-destructive transition-colors"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {errors?.features && <p className="text-sm text-destructive">{errors.features}</p>}
                </div>
            </div>

            {/* Section 3: Status (only for edit) */}
            {showActiveToggle && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b">
                        <h3 className="text-lg font-semibold">Status</h3>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="active"
                            checked={values.active !== false}
                            onCheckedChange={(checked) => handleChange("active", checked)}
                        />
                        <Label htmlFor="active" className="cursor-pointer">
                            Active Plan
                        </Label>
                    </div>
                </div>
            )}
        </div>
    );
}
