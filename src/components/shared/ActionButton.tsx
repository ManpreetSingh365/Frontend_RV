import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
    icon: LucideIcon;
    label: string;
    shortLabel?: string;
    onClick?: () => void;
    variant?: "default" | "outline" | "ghost" | "destructive";
    disabled?: boolean;
}

export function ActionButton({
    icon: Icon,
    label,
    shortLabel,
    onClick,
    variant = "default",
    disabled = false
}: ActionButtonProps) {
    return (
        <Button
            variant={variant}
            size="default"
            className="flex-1 sm:flex-initial sm:w-auto justify-center text-xs sm:text-sm md:text-base h-9 sm:h-10 px-3 sm:px-4 font-medium shadow-sm hover:shadow-md transition-all active:scale-95"
            onClick={onClick}
            disabled={disabled}
        >
            <Icon className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden min-[375px]:inline">{label}</span>
            {shortLabel && <span className="min-[375px]:hidden">{shortLabel}</span>}
        </Button>
    );
}
