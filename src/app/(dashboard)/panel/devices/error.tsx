"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function DevicesErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <ErrorState
            title="Something went wrong!"
            message={error.message || "Failed to load devices"}
            onRetry={reset}
        />
    );
}
