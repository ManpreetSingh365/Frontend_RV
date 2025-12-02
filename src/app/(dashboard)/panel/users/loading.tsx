import { LoadingState } from "@/components/ui/loading-state";

export default function Loading() {
    return (
        <div className="w-full max-w-full p-4 sm:p-6 md:p-8">
            <div className="space-y-4">
                <LoadingState rows={8} />
            </div>
        </div>
    );
}
