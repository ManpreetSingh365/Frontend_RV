import { FileQuestion, Search, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type IconType = "search" | "inbox" | "file";

interface EmptyStateProps {
    icon?: IconType | ReactNode;
    title?: string;
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const ICONS: Record<IconType, typeof Search> = {
    search: Search,
    inbox: Inbox,
    file: FileQuestion,
};

export function EmptyState({
    icon = "inbox",
    title = "No data found",
    message,
    action
}: EmptyStateProps) {
    const IconComponent = typeof icon === "string" ? ICONS[icon as IconType] : null;

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="flex flex-col items-center space-y-4 max-w-md text-center">
                <div className="rounded-full bg-muted p-3">
                    {IconComponent ? (
                        <IconComponent className="h-8 w-8 text-muted-foreground" />
                    ) : (
                        icon
                    )}
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground">{message}</p>
                </div>
                {action && (
                    <Button onClick={action.onClick} variant="default">
                        {action.label}
                    </Button>
                )}
            </div>
        </div>
    );
}
