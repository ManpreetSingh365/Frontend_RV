import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { RequiredLabel, FieldRow } from "@/components/ui/form/index";
import { CategoryPermissionSelector } from "@/components/ui/category-permission-selector";
import type { CreateRoleInput } from "@/lib/validation/role.schema";
import type { PermissionCategory } from "@/lib/util/permission-utils";

interface RoleDetailsFormProps {
    form: UseFormReturn<CreateRoleInput>;
    permissionCategories: PermissionCategory[];
    loading: boolean;
}

export function RoleDetailsForm({
    form,
    permissionCategories,
    loading,
    children
}: RoleDetailsFormProps & { children?: React.ReactNode }) {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-12">
                <div className="md:col-span-6 space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <RequiredLabel>Role Name</RequiredLabel>
                                <FormControl>
                                    <Input placeholder="Enter role name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="roleLevel"
                        render={({ field }) => (
                            <FormItem>
                                <RequiredLabel>Role Level</RequiredLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={1}
                                        placeholder="Enter role level"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="md:col-span-4 space-y-4">
                    <FormField
                        control={form.control}
                        name="active"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm h-full">
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Active Status</FormLabel>
                                    <FormDescription>
                                        Enable or disable this role
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Enter role description"
                                className="resize-none"
                                rows={3}
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="permissions"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Permissions</FormLabel>
                        <FormDescription>
                            Select permissions for this role by category
                        </FormDescription>
                        <FormControl>
                            <CategoryPermissionSelector
                                categories={permissionCategories}
                                selectedPermissions={field.value || []}
                                onChange={field.onChange}
                                disabled={loading}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {children}
        </div>
    );
}
