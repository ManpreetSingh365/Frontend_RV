import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="w-full max-w-full p-4 sm:p-6 md:p-8">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <EmptyState
                    icon="search"
                    title="User not found"
                    message="The user you're looking for doesn't exist or has been removed"
                />
                <Link href="/panel/users" className="mt-6">
                    <Button variant="outline">
                        <Home className="mr-2 h-4 w-4" />
                        Back to Users
                    </Button>
                </Link>
            </div>
        </div>
    );
}
