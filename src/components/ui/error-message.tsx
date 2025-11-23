import { cn } from "@/lib/util/utils";

interface ErrorMessageProps {
    errors?: string[];
    className?: string;
    id?: string;
}

export function ErrorMessage({ errors, className, id }: ErrorMessageProps) {
    if (!errors || errors.length === 0) {
        return null;
    }

    return (
        <div
            id={id}
            role="alert"
            aria-live="polite"
            className={cn(
                "text-sm text-red-600 dark:text-red-400 mt-1.5 space-y-1",
                className
            )}
        >
            {errors.map((error, index) => (
                <p key={index}>{error}</p>
            ))}
        </div>
    );
}
