"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus } from "lucide-react";
import { safeParse } from "valibot";

import { createUser } from "@/lib/service/user.service";
import { createUserSchema, type CreateUserInput } from "@/lib/validation/user.schema";
import { useRoles } from "../hooks/use-roles";
import { useAddressTypes } from "../hooks/use-address-types";

interface AddUserDialogProps {
    onUserCreated?: () => void;
    children?: React.ReactNode;
}

const INITIAL_FORM_STATE: Partial<CreateUserInput> = {
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    phoneNumber: "",
    vehicleCreditLimit: 0,
    roleId: "",
    vehicleIds: [],
    addresses: [{
        streetLine1: "",
        streetLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        landmark: "",
        addressType: "HOME",
        primaryAddress: true,
    }],
};

export default function AddUserDialog({ onUserCreated, children }: AddUserDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState<Partial<CreateUserInput>>(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [globalError, setGlobalError] = useState("");

    // Custom hooks for data fetching
    const { roles, loading: loadingRoles } = useRoles();
    const { addressTypes, loading: loadingAddressTypes } = useAddressTypes();

    const resetForm = () => {
        setFormData(INITIAL_FORM_STATE);
        setErrors({});
        setGlobalError("");
    };

    const updateFormField = (field: keyof CreateUserInput, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateAddressField = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            addresses: [{
                ...prev.addresses![0],
                [field]: value,
            }],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setGlobalError("");

        const result = safeParse(createUserSchema, formData);

        if (!result.success) {
            const fieldErrors: Record<string, string[]> = {};
            result.issues.forEach(issue => {
                const key = String(issue.path?.[0] ?? "");
                if (key) {
                    fieldErrors[key] = fieldErrors[key] || [];
                    fieldErrors[key].push(issue.message);
                }
            });
            setErrors(fieldErrors);
            return;
        }

        startTransition(async () => {
            try {
                await createUser(result.output as any);
                setOpen(false);
                resetForm();
                onUserCreated?.();
            } catch (error: any) {
                setGlobalError(error.messages?.[0] || error.message || "Failed to create user");
            }
        });
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New User
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                        Fill in the form below to create a new user account.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Global Error */}
                    {globalError && (
                        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                            {globalError}
                        </div>
                    )}

                    {/* User Details */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b">
                            <h3 className="text-lg font-semibold">User Details</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                id="username"
                                label="Username"
                                value={formData.username}
                                onChange={(e) => updateFormField("username", e.target.value)}
                                error={errors.username?.[0]}
                                placeholder="johndoe"
                                required
                            />
                            <FormField
                                id="email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateFormField("email", e.target.value)}
                                error={errors.email?.[0]}
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                id="firstName"
                                label="First Name"
                                value={formData.firstName}
                                onChange={(e) => updateFormField("firstName", e.target.value)}
                                error={errors.firstName?.[0]}
                                placeholder="John"
                                required
                            />
                            <FormField
                                id="lastName"
                                label="Last Name"
                                value={formData.lastName}
                                onChange={(e) => updateFormField("lastName", e.target.value)}
                                error={errors.lastName?.[0]}
                                placeholder="Doe"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                id="password"
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => updateFormField("password", e.target.value)}
                                error={errors.password?.[0]}
                                placeholder="Min. 8 characters"
                                required
                            />
                            <FormField
                                id="phoneNumber"
                                label="Phone Number"
                                value={formData.phoneNumber}
                                onChange={(e) => updateFormField("phoneNumber", e.target.value)}
                                error={errors.phoneNumber?.[0]}
                                placeholder="+919876543210"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="roleId">Role <span className="text-red-500"> *</span></Label>
                                <Select
                                    value={formData.roleId || ""}
                                    onValueChange={(value) => updateFormField("roleId", value)}
                                    disabled={loadingRoles}
                                >
                                    <SelectTrigger id="roleId">
                                        <SelectValue placeholder={loadingRoles ? "Loading..." : "Select role"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.id}>
                                                <div className="flex flex-col text-left">
                                                    <span className="font-medium">{role.name}</span>
                                                    {role.description && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {role.description}
                                                        </span>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.roleId && (
                                    <p className="text-sm text-destructive">{errors.roleId[0]}</p>
                                )}
                            </div>

                            <FormField
                                id="vehicleCreditLimit"
                                label="Vehicle Credit Limit"
                                type="number"
                                min={0}
                                value={formData.vehicleCreditLimit}
                                onChange={(e) => updateFormField("vehicleCreditLimit", Number(e.target.value))}
                                error={errors.vehicleCreditLimit?.[0]}
                            />
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b pt-2">
                            <h3 className="text-lg font-semibold">Address Information</h3>
                        </div>
                        <div className="flex items-center space-x-2 pb-4">
                            <Checkbox
                                id="primaryAddress"
                                checked={formData.addresses?.[0]?.primaryAddress || false}
                                onCheckedChange={(checked) => updateAddressField("primaryAddress", checked)}
                            />
                            <Label htmlFor="primaryAddress" className="cursor-pointer">
                                Primary Address
                            </Label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                id="streetLine1"
                                label="Street Line 1"
                                value={formData.addresses?.[0]?.streetLine1 || ""}
                                onChange={(e) => updateAddressField("streetLine1", e.target.value)}
                                placeholder="123 Main Street"
                                required
                            />
                            <FormField
                                id="streetLine2"
                                label="Street Line 2"
                                value={formData.addresses?.[0]?.streetLine2 || ""}
                                onChange={(e) => updateAddressField("streetLine2", e.target.value)}
                                placeholder="Apartment 4B"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                id="city"
                                label="City"
                                value={formData.addresses?.[0]?.city || ""}
                                onChange={(e) => updateAddressField("city", e.target.value)}
                                placeholder="Amritsar"
                                required
                            />
                            <FormField
                                id="state"
                                label="State"
                                value={formData.addresses?.[0]?.state || ""}
                                onChange={(e) => updateAddressField("state", e.target.value)}
                                placeholder="Punjab"
                                required
                            />
                            <FormField
                                id="postalCode"
                                label="Postal Code"
                                value={formData.addresses?.[0]?.postalCode || ""}
                                onChange={(e) => updateAddressField("postalCode", e.target.value)}
                                placeholder="143001"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                id="country"
                                label="Country"
                                value={formData.addresses?.[0]?.country || ""}
                                onChange={(e) => updateAddressField("country", e.target.value)}
                                placeholder="India"
                                required
                            />
                            <FormField
                                id="landmark"
                                label="Landmark"
                                value={formData.addresses?.[0]?.landmark || ""}
                                onChange={(e) => updateAddressField("landmark", e.target.value)}
                                placeholder="Near Central Park"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="addressType">Address Type <span className="text-red-500"> *</span></Label>
                                <Select
                                    value={formData.addresses?.[0]?.addressType || "HOME"}
                                    onValueChange={(value) => updateAddressField("addressType", value)}
                                    disabled={loadingAddressTypes}
                                >
                                    <SelectTrigger id="addressType">
                                        <SelectValue placeholder={loadingAddressTypes ? "Loading..." : "Select type"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {addressTypes.map((type) => (
                                            <SelectItem key={type.name} value={type.name}>
                                                <div className="flex flex-col text-left">
                                                    <span className="font-medium">{type.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {type.description}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create User
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Reusable FormField component
interface FormFieldProps {
    id: string;
    label: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    min?: number;
}

function FormField({ id, label, value, onChange, error, type = "text", placeholder, required, min }: FormFieldProps) {
    return (
        <div className="space-y-3">
            <Label htmlFor={id}>
                {label}
                {required && <span className="text-red-500"> *</span>}
            </Label>
            <Input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                min={min}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
