"use client";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
        <div className="space-y-4">
            {/* Name */}
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

            {/* Amount */}
            <div className="space-y-2">
                <Label htmlFor="amount">
                    Amount (₹) <span className="text-destructive">*</span>
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

            {/* Features */}
            <div className="space-y-2">
                <Label>Features</Label>
                <div className="flex gap-2">
                    <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Add a feature"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} size="sm">
                        Add
                    </Button>
                </div>
                {values.features && values.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {values.features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm"
                            >
                                <span>{feature}</span>
                                <button
                                    type="button"
                                    onClick={() => removeFeature(index)}
                                    className="hover:text-destructive"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {errors?.features && <p className="text-sm text-destructive">{errors.features}</p>}
            </div>

            {/* Active Toggle (only for edit) */}
            {showActiveToggle && (
                <div className="flex items-center space-x-2">
                    <Switch
                        id="active"
                        checked={values.active !== false}
                        onCheckedChange={(checked) => handleChange("active", checked)}
                    />
                    <Label htmlFor="active" className="cursor-pointer">
                        Active
                    </Label>
                </div>
            )}
        </div>
    );
}
