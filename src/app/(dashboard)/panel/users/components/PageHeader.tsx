"use client";

import { Button } from "@/components/ui/button";
import { Download, Grid3x3, Plus } from "lucide-react";

export default function PageHeader() {
    return (
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-semibold text-foreground">User Management</h1>
            <div className="flex gap-3">
                <Button variant="outline" size="default">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
                <Button variant="outline" size="default">
                    <Grid3x3 className="mr-2 h-4 w-4" />
                    Bulk Actions
                </Button>
                <Button variant="default" size="default">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New User
                </Button>
            </div>
        </div>
    );
}
