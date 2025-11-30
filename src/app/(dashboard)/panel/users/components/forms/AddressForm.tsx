import { UseFormReturn, FieldPath } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SearchableCombobox, type ComboboxOption } from "@/components/ui/searchable-combobox";
import type { CreateUserInput, UpdateUserInput } from "@/lib/validation/user.schema";

interface AddressFormProps {
    form: UseFormReturn<CreateUserInput> | UseFormReturn<UpdateUserInput>;
    addressTypeOptions: ComboboxOption[];
    loading: boolean;
}

export function AddressForm({
    form,
    addressTypeOptions,
    loading,
}: AddressFormProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b pt-2">
                <h3 className="text-lg font-semibold">Address Information</h3>
            </div>

            {/* Street Lines */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                    control={form.control as any}
                    name="addresses.0.streetLine1"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Street Line 1 <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="123 Main Street" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control as any}
                    name="addresses.0.streetLine2"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Street Line 2</FormLabel>
                            <FormControl>
                                <Input placeholder="Apartment 4B" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* City, State, Postal Code */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                    control={form.control as any}
                    name="addresses.0.city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                City <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Amritsar" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control as any}
                    name="addresses.0.state"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                State <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Punjab" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control as any}
                    name="addresses.0.postalCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                                <Input placeholder="143001" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Country & Landmark */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                    control={form.control as any}
                    name="addresses.0.country"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Country <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="India" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control as any}
                    name="addresses.0.landmark"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Landmark</FormLabel>
                            <FormControl>
                                <Input placeholder="Near Central Park" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Address Type &Primary Address */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                    control={form.control as any}
                    name="addresses.0.addressType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Address Type <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <SearchableCombobox
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={addressTypeOptions}
                                    loading={loading}
                                    placeholder="Select type"
                                    searchPlaceholder="Search address types..."
                                    emptyMessage="No address types found"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control as any}
                    name="addresses.0.primaryAddress"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 pt-8">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel className="cursor-pointer !mt-0">
                                Primary Address
                            </FormLabel>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
