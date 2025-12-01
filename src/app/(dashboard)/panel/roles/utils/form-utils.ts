import type { ComboboxOption } from "@/components/ui/searchable-combobox";

export function transformPermissionsToOptions(permissions: string[]): ComboboxOption[] {
    return permissions.map((permission) => ({
        value: permission,
        label: permission.split('_').join(' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
        description: undefined,
    }));
}
