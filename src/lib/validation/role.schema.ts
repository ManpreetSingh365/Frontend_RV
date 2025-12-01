import {
    object,
    string,
    pipe,
    minLength,
    maxLength,
    array,
    optional,
    boolean,
    number,
    minValue,
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
    roleLevel: pipe(
        number(),
        minValue(1, "Role level must be at least 1")
    ),
    permissions: optional(array(string())),
    active: optional(boolean())
});

export type CreateRoleInput = {
    name: string;
    description?: string;
    roleLevel: number;
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
    roleLevel: optional(
        pipe(
            number(),
            minValue(1, "Role level must be at least 1")
        )
    ),
    permissions: optional(array(string())),
    active: optional(boolean())
});

export type UpdateRoleInput = {
    name?: string;
    description?: string;
    roleLevel?: number;
    permissions?: string[];
    active?: boolean;
};
