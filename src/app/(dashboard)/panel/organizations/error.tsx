"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function OrganizationsErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <ErrorState
            title="Something went wrong!"
            message={error.message || "Failed to load organizations"}
            onRetry={reset}
        />
    );
}
