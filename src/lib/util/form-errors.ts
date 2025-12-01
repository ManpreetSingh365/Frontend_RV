import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { ApiError } from "@/lib/api/types";

/**
 * Maps API field errors to react-hook-form errors
 * @param error - The caught error (should be ApiError)
 * @param setError - React Hook Form setError function
 * @returns The first global error message, or undefined if only field errors exist
 */
export function handleApiFormErrors<T extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<T>
): string | undefined {
    if (!(error instanceof ApiError)) {
        // Not an ApiError, return generic message
        return error instanceof Error ? error.message : "An unexpected error occurred";
    }

    // Map field-level errors to form fields
    if (error.fieldErrors && error.fieldErrors.length > 0) {
        error.fieldErrors.forEach(({ field, message }) => {
            setError(field as Path<T>, {
                type: "server",
                message,
            });
        });
    }

    // Return first global message if exists, otherwise undefined
    return error.messages && error.messages.length > 0 ? error.messages[0] : undefined;
}
