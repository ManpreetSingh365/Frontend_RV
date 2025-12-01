import { useState, useCallback } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { handleApiFormErrors } from "@/lib/util/form-errors";

interface UseEntityFormOptions<TInput extends FieldValues, TOutput = any> {
    form: UseFormReturn<TInput>;
    onSubmit: (data: TInput) => Promise<TOutput>;
    onSuccess?: (data: TOutput) => void;
    successMessage?: string;
    onError?: (error: any) => void;
}

export function useEntityForm<TInput extends FieldValues, TOutput = any>({
    form,
    onSubmit,
    onSuccess,
    successMessage = "Operation successful",
    onError
}: UseEntityFormOptions<TInput, TOutput>) {
    const [isPending, setIsPending] = useState(false);
    const [globalError, setGlobalError] = useState("");

    const handleSubmit = useCallback(
        async (data: TInput) => {
            setGlobalError("");
            setIsPending(true);

            try {
                const response = await onSubmit(data);
                toast.success(successMessage);
                form.reset();
                onSuccess?.(response);
            } catch (error: any) {
                const errorMessage = handleApiFormErrors(error, form.setError);
                if (errorMessage) {
                    setGlobalError(errorMessage);
                    toast.error(errorMessage);
                }
                onError?.(error);
            } finally {
                setIsPending(false);
            }
        },
        [onSubmit, successMessage, form, onSuccess, onError]
    );

    return {
        handleSubmit,
        isPending,
        globalError,
        setGlobalError
    };
}
