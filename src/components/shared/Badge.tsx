import { cn } from "@/lib/util/utils";
import type { StatusVariant } from "@/lib/types/entity";

interface BadgeProps {
    variant: StatusVariant;
    children: React.ReactNode;
    showDot?: boolean;
    className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
    active: "border-green-500/40 bg-green-500/15 text-green-500",
    inactive: "border-red-500/40 bg-red-500/15 text-red-500",
    pending: "border-yellow-500/40 bg-yellow-500/15 text-yellow-500",
    error: "border-red-600/40 bg-red-600/15 text-red-600",
    success: "border-green-600/40 bg-green-600/15 text-green-600",
    warning: "border-orange-500/40 bg-orange-500/15 text-orange-500",
};

const dotStyles: Record<StatusVariant, string> = {
    active: "bg-green-500",
    inactive: "bg-red-500",
    pending: "bg-yellow-500",
    error: "bg-red-600",
    success: "bg-green-600",
    warning: "bg-orange-500",
};

/**
 * Status Badge Component
 * Displays status with predefined color variants
 * 
 * @example
 * <Badge variant="active">Active</Badge>
 * <Badge variant="error" showDot>Error</Badge>
 */
export function Badge({ variant, children, showDot = false, className }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                variantStyles[variant],
                className
            )}
        >
            {showDot && (
                <span className={cn("h-1.5 w-1.5 rounded-full", dotStyles[variant])} />
            )}
            {children}
        </span>
    );
}
