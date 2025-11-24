import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SearchableCombobox, type ComboboxOption } from "@/components/ui/searchable-combobox";
import type { CreateUserInput } from "@/lib/validation/user.schema";

interface UserDetailsFormProps {
    form: UseFormReturn<CreateUserInput>;
    roleOptions: ComboboxOption[];
    vehicleOptions: ComboboxOption[];
    loadingRoles: boolean;
    loadingVehicles: boolean;
}

export function UserDetailsForm({
    form,
    roleOptions,
    vehicleOptions,
    loadingRoles,
    loadingVehicles,
}: UserDetailsFormProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="text-lg font-semibold">User Details</h3>
            </div>

            {/* Username & Email */}
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Username <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="johndoe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Email <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                First Name <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Last Name <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Password & Phone Number */}
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Password <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Min. 6 characters" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Phone Number <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="+919876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Role & Vehicle */}
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="roleId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Role <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <SearchableCombobox
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={roleOptions}
                                    loading={loadingRoles}
                                    placeholder="Select role"
                                    searchPlaceholder="Search roles..."
                                    emptyMessage="No roles found"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="vehicleIds.0"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Assign Vehicle</FormLabel>
                            <FormControl>
                                <SearchableCombobox
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    options={vehicleOptions}
                                    loading={loadingVehicles}
                                    placeholder="Select vehicle"
                                    searchPlaceholder="Search vehicles..."
                                    emptyMessage="No vehicles found"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* vehicleCreditLimit */}
                <FormField
                    control={form.control}
                    name="vehicleCreditLimit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Vehicle Credit Limit <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
