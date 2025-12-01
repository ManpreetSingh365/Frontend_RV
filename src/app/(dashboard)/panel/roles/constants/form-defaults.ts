import type { CreateRoleInput } from "@/lib/validation/role.schema";

export const INITIAL_ROLE_FORM_VALUES: Partial<CreateRoleInput> = {
    name: "",
    description: "",
    roleLevel: 3,
    permissions: [],
    active: true,
};
