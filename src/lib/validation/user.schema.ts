// src/lib/validation/user.schema.ts
import {
    object,
    string,
    pipe,
    minLength,
    maxLength,
    email,
    regex,
    number,
    array,
    optional,
    boolean,
    minValue,
} from "valibot";

/**
 * UUID Regex
 */
const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

/**
 * Address schema
 */
const addressSchema = object({
    streetLine1: pipe(
        string(),
        minLength(1, "Street line 1 is required")
    ),

    streetLine2: optional(string()),

    city: pipe(
        string(),
        minLength(1, "City is required")
    ),

    state: pipe(
        string(),
        minLength(1, "State is required")
    ),

    postalCode: optional(
        pipe(
            string(),
            regex(/^\d{6}$/, "Postal code must be 6 digits")
        )
    ),

    country: pipe(
        string(),
        minLength(1, "Country is required")
    ),

    landmark: optional(string()),

    addressType: pipe(string(), minLength(1, "Address type is required")),

    primaryAddress: optional(boolean(), true)
});

/**
 * User Create schema
 */
export const createUserSchema = object({
    username: pipe(
        string(),
        minLength(3, "Username must be at least 3 characters"),
        maxLength(100, "Username must not exceed 100 characters"),
        regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    ),

    email: optional(
        pipe(
            string(),
            maxLength(100, "Email must not exceed 100 characters"),
            email("Please enter a valid email address")
        )
    ),

    firstName: pipe(
        string(),
        minLength(1, "First name is required"),
        maxLength(100, "First name must not exceed 100 characters")
    ),

    lastName: pipe(
        string(),
        minLength(1, "Last name is required"),
        maxLength(100, "Last name must not exceed 100 characters")
    ),

    password: pipe(
        string(),
        minLength(6, "Password must be at least 6 characters")
    ),

    phoneNumber: pipe(
        string(),
        maxLength(15, "Phone number must not exceed 15 characters"),
        regex(/^\+?[1-9]\d{9,14}$/, "Please enter a valid phone number (e.g., +919876543210)")
    ),

    vehicleCreditLimit: optional(
        pipe(
            number(),
            minValue(0, "Credit limit must be 0 or greater")
        )
    ),

    roleId: optional(
        pipe(
            string(),
            regex(uuidRegex, "Role ID must be a valid UUID")
        )
    ),

    vehicleIds: optional(
        array(
            pipe(
                string(),
                regex(uuidRegex, "Vehicle ID must be a valid UUID")
            )
        )
    ),

    addresses: optional(
        array(addressSchema)
    )
});

/**
 * Strict Type
 */
export type CreateUserInput = {
    username: string;
    email?: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber: string;
    vehicleCreditLimit?: number;
    roleId?: string;
    vehicleIds?: string[];
    addresses?: {
        streetLine1: string;
        streetLine2?: string;
        city: string;
        state: string;
        postalCode?: string;
        country: string;
        landmark?: string;
        addressType: string;
        primaryAddress?: boolean;
    }[];
};