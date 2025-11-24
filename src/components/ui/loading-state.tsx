import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
    message?: string;
    rows?: number;
    showSpinner?: boolean;
}

export function LoadingState({
    message = "Loading...",
    rows = 5,
    showSpinner = false
}: LoadingStateProps) {
    if (showSpinner) {
        return (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
            ))}
        </div>
    );
}
