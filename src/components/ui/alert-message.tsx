import { cn } from "@/lib/util/utils";

type AlertVariant = "error" | "success" | "warning" | "info";

interface AlertMessageProps {
    message?: string;
    variant?: AlertVariant;
    className?: string;
}

const variantStyles: Record<AlertVariant, string> = {
    error: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400",
    success: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400",
    warning: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400",
    info: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400",
};

/**
 * Universal alert component for displaying backend messages
 * Supports multiple variants: error, success, warning, info
 */
export function AlertMessage({
    message,
    variant = "error",
    className
}: AlertMessageProps) {
    if (!message) {
        return null;
    }

    return (
        <div
            role="alert"
            aria-live={variant === "error" ? "assertive" : "polite"}
            className={cn(
                "border rounded-md p-3 text-center text-sm",
                variantStyles[variant],
                className
            )}
        >
            {message}
        </div>
    );
}
