"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, Plus, Download, Upload, Loader2, LucideIcon } from "lucide-react";
import type { ActionVariant } from "@/lib/types/entity";

// New API (variant-based)
interface NewActionButtonProps {
    variant: ActionVariant;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
    tooltip?: string;
    size?: "default" | "sm" | "lg" | "icon";
    icon?: never;
    label?: never;
    shortLabel?: never;
}

// Old API (icon + label based) - for backward compatibility
interface OldActionButtonProps {
    icon: LucideIcon;
    label: string;
    shortLabel?: string;
    variant?: "default" | "outline" | "ghost";
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
}

type ActionButtonProps = NewActionButtonProps | OldActionButtonProps;

const iconMap: Record<ActionVariant, typeof Edit> = {
    edit: Edit,
    delete: Trash2,
    view: Eye,
    add: Plus,
    download: Download,
    upload: Upload,
};

const variantStyles: Record<ActionVariant, string> = {
    edit: "hover:text-blue-600 hover:bg-blue-50",
    delete: "hover:text-destructive hover:bg-destructive/10",
    view: "hover:text-primary hover:bg-primary/10",
    add: "hover:text-green-600 hover:bg-green-50",
    download: "hover:text-purple-600 hover:bg-purple-50",
    upload: "hover:text-indigo-600 hover:bg-indigo-50",
};

const defaultTooltips: Record<ActionVariant, string> = {
    edit: "Edit",
    delete: "Delete",
    view: "View",
    add: "Add",
    download: "Download",
    upload: "Upload",
};

/**
 * Standardized Action Button Component
 * Supports both new variant-based API and old icon+label API for backward compatibility
 * 
 * @example
 * // New API (variant-based)
 * <ActionButton variant="edit" onClick={handleEdit} tooltip="Edit user" />
 * <ActionButton variant="delete" onClick={handleDelete} loading={isDeleting} />
 * 
 * // Old API (icon+label based)
 * <ActionButton icon={Plus} label="Add New" shortLabel="Add" />
 */
export function ActionButton(props: ActionButtonProps) {
    // Check if using old API (has icon prop)
    if ('icon' in props && props.icon) {
        const { icon: Icon, label, shortLabel, variant = "default", onClick, loading = false, disabled = false } = props;

        return (
            <Button
                variant={variant}
                onClick={onClick}
                disabled={disabled || loading}
                className="gap-2"
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Icon className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{label}</span>
                {shortLabel && <span className="sm:hidden">{shortLabel}</span>}
            </Button>
        );
    }

    // New API (variant-based)
    const { variant, onClick, loading = false, disabled = false, tooltip, size = "icon" } = props as NewActionButtonProps;
    const Icon = iconMap[variant];
    const displayTooltip = tooltip || defaultTooltips[variant];

    return (
        <Button
            variant="ghost"
            size={size}
            onClick={onClick}
            disabled={disabled || loading}
            className={variantStyles[variant]}
            title={displayTooltip}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Icon className="h-4 w-4" />
            )}
            <span className="sr-only">{displayTooltip}</span>
        </Button>
    );
}
