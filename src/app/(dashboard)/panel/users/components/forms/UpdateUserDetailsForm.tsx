import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SearchableCombobox, type ComboboxOption } from "@/components/ui/searchable-combobox";
import { RequiredLabel, FieldRow, MultiSelectField } from "@/components/ui/form/index";
import type { UpdateUserInput } from "@/lib/validation/user.schema";

interface UpdateUserDetailsFormProps {
    form: UseFormReturn<UpdateUserInput>;
    roleOptions: ComboboxOption[];
    vehicleOptions: ComboboxOption[];
    loadingRoles: boolean;
    loadingVehicles: boolean;
}

export function UpdateUserDetailsForm({
    form,
    roleOptions,
    vehicleOptions,
    loadingRoles,
    loadingVehicles,
}: UpdateUserDetailsFormProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="text-lg font-semibold">User Details</h3>
            </div>

            <FieldRow>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="john@example.com" {...field} />
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
                            <RequiredLabel>Phone Number</RequiredLabel>
                            <FormControl>
                                <Input placeholder="+919876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </FieldRow>

            <FieldRow>
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <RequiredLabel>First Name</RequiredLabel>
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
                            <RequiredLabel>Last Name</RequiredLabel>
                            <FormControl>
                                <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </FieldRow>

            <FieldRow>
                <FormField
                    control={form.control}
                    name="roleId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                                <SearchableCombobox
                                    value={field.value || ""}
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
                    name="vehicleIds"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Assign Vehicles</FormLabel>
                            <FormControl>
                                <MultiSelectField
                                    value={field.value || []}
                                    onChange={field.onChange}
                                    options={vehicleOptions}
                                    loading={loadingVehicles}
                                    placeholder="Select vehicles..."
                                    searchPlaceholder="Search vehicles..."
                                    emptyMessage="No vehicles found"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </FieldRow>
        </div>
    );
}
