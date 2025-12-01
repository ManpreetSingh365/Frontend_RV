import {
    object,
    string,
    pipe,
    minLength,
    maxLength,
    array,
    optional,
    boolean,
} from "valibot";

/**
 * Role Create schema
 */
export const createRoleSchema = object({
    name: pipe(
        string(),
        minLength(1, "Role name is required"),
        maxLength(50, "Role name must not exceed 50 characters")
    ),
    description: optional(
        pipe(
            string(),
            maxLength(255, "Description must not exceed 255 characters")
        )
    ),
    permissions: optional(array(string())),
    active: optional(boolean())
});

export type CreateRoleInput = {
    name: string;
    description?: string;
    permissions?: string[];
    active?: boolean;
};

/**
 * Role Update schema
 */
export const updateRoleSchema = object({
    name: optional(
        pipe(
            string(),
            minLength(1, "Role name is required"),
            maxLength(50, "Role name must not exceed 50 characters")
        )
    ),
    description: optional(
        pipe(
            string(),
            maxLength(255, "Description must not exceed 255 characters")
        )
    ),
    permissions: optional(array(string())),
    active: optional(boolean())
});

export type UpdateRoleInput = {
    name?: string;
    description?: string;
    permissions?: string[];
    active?: boolean;
};
