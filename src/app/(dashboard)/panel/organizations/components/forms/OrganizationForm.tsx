"use client";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Organization form schema
export const organizationFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    domain: z.string().min(1, "Domain is required"),
    description: z.string().optional(),
    settings: z.string().optional(),
    active: z.boolean().optional(),
});

export type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

interface OrganizationFormProps {
    values: OrganizationFormValues;
    onChange: (values: OrganizationFormValues) => void;
    errors?: Partial<Record<keyof OrganizationFormValues, string>>;
    showActiveToggle?: boolean;
}

export function OrganizationForm({ values, onChange, errors, showActiveToggle = false }: OrganizationFormProps) {
    const handleChange = (field: keyof OrganizationFormValues, value: any) => {
        onChange({ ...values, [field]: value });
    };

    return (
        <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
                <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="name"
                    value={values.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter organization name"
                />
                {errors?.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            {/* Domain */}
            <div className="space-y-2">
                <Label htmlFor="domain">
                    Domain <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="domain"
                    value={values.domain || ""}
                    onChange={(e) => handleChange("domain", e.target.value)}
                    placeholder="example.com"
                />
                {errors?.domain && <p className="text-sm text-destructive">{errors.domain}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={values.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Enter organization description"
                    rows={3}
                />
                {errors?.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            {/* Settings */}
            <div className="space-y-2">
                <Label htmlFor="settings">Settings</Label>
                <Textarea
                    id="settings"
                    value={values.settings || ""}
                    onChange={(e) => handleChange("settings", e.target.value)}
                    placeholder="Enter organization settings"
                    rows={3}
                />
                {errors?.settings && <p className="text-sm text-destructive">{errors.settings}</p>}
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
