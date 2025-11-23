'use client';

import { useFormStatus } from "react-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/util/utils";
import type { VariantProps } from "class-variance-authority";

interface SubmitButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
    /**
     * Text to display while the form is submitting
     * @default "Submitting..."
     */
    loadingText?: string;
    /**
     * Whether to show a loading spinner
     * @default true
     */
    showSpinner?: boolean;
    /**
     * Children to render when not in loading state
     * If not provided, button text from children will be used
     */
    children?: React.ReactNode;
}

/**
 * Universal submit button component that uses useFormStatus hook
 * Must be used within a form to properly access form status
 * 
 * @example
 * ```tsx
 * <form action={formAction}>
 *   <SubmitButton>Sign In</SubmitButton>
 * </form>
 * 
 * <form action={formAction}>
 *   <SubmitButton loadingText="Creating account..." variant="default" size="lg">
 *     Create Account
 *   </SubmitButton>
 * </form>
 * ```
 */
export function SubmitButton({
    loadingText = "Submitting...",
    showSpinner = true,
    children = "Submit",
    className,
    disabled,
    variant,
    size,
    ...props
}: SubmitButtonProps) {
    const { pending } = useFormStatus();

    const isDisabled = disabled || pending;
    const ariaLabel = pending
        ? loadingText
        : typeof children === 'string' ? children : 'Submit';

    return (
        <Button
            type="submit"
            disabled={isDisabled}
            aria-label={ariaLabel}
            variant={variant}
            size={size}
            className={cn("w-full", className)}
            {...props}
        >
            {pending ? (
                <span className="flex items-center gap-2 justify-center">
                    {showSpinner && (
                        <span
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                            aria-hidden="true"
                        />
                    )}
                    {loadingText}
                </span>
            ) : (
                children
            )}
        </Button>
    );
}
