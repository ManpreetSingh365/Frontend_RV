"use client";

import { ErrorState } from "@/components/ui/error-state";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to error reporting service
        console.error("Roles page error:", error);
    }, [error]);

    return (
        <div className="w-full max-w-full p-4 sm:p-6 md:p-8">
            <ErrorState
                title="Failed to load roles"
                message={error.message || "An unexpected error occurred"}
                onRetry={reset}
            />
        </div>
    );
}
