import { useState, useCallback } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { toast } from "sonner";

interface UseEntityFormProps<TData extends FieldValues> {
    form: UseFormReturn<TData>;
    onSubmit: (data: TData) => Promise<void>;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    successMessage?: string;
    errorMessage?: string;
}

/**
 * Hook to handle entity form submission with loading, error handling, and reset
 * Works with react-hook-form for consistent form behavior
 * 
 * @example
 * const form = useForm<CreateUserInput>({ resolver: zodResolver(createUserSchema) });
 * const { handleSubmit, isSubmitting } = useEntityForm({
 *   form,
 *   onSubmit: async (data) => await createUser(data),
 *   onSuccess: () => dialog.close(),
 *   successMessage: "User created successfully"
 * });
 * 
 * <form onSubmit={handleSubmit}>
 *   <Button type="submit" disabled={isSubmitting}>Save</Button>
 * </form>
 */
export function useEntityForm<TData extends FieldValues>({
    form,
    onSubmit,
    onSuccess,
    onError,
    successMessage = "Operation completed successfully",
    errorMessage = "An error occurred",
}: UseEntityFormProps<TData>) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(
        async (e?: React.FormEvent) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            return form.handleSubmit(async (data) => {
                setIsSubmitting(true);
                try {
                    await onSubmit(data);
                    toast.success(successMessage);
                    form.reset();
                    onSuccess?.();
                } catch (error) {
                    const err = error as Error;
                    const message = (err as any).messages?.[0] || err.message || errorMessage;
                    toast.error(message);
                    onError?.(err);
                } finally {
                    setIsSubmitting(false);
                }
            })(e);
        },
        [form, onSubmit, onSuccess, onError, successMessage, errorMessage]
    );

    const reset = useCallback(() => {
        form.reset();
    }, [form]);

    return {
        handleSubmit,
        isSubmitting,
        reset,
        formState: form.formState,
    };
}
