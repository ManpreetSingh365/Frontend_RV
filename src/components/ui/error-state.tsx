import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    retryLabel?: string;
}

export function ErrorState({
    title = "Error",
    message,
    onRetry,
    retryLabel = "Try again"
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="flex flex-col items-center space-y-4 max-w-md text-center">
                <div className="rounded-full bg-destructive/10 p-3">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground">{message}</p>
                </div>
                {onRetry && (
                    <Button onClick={onRetry} variant="outline">
                        {retryLabel}
                    </Button>
                )}
            </div>
        </div>
    );
}
