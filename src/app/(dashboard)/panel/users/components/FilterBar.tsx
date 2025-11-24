"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface FilterBarProps {
    searchTerm: string;
    onSearchChange: (search: string) => void;
}

export default function FilterBar({ searchTerm, onSearchChange }: FilterBarProps) {
    return (
        <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search by name, username, or mobile..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="flex items-center gap-2">
                <Label htmlFor="status-filter" className="text-sm text-muted-foreground whitespace-nowrap">
                    Status:
                </Label>
                <Select defaultValue="all">
                    <SelectTrigger id="status-filter" className="w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <Label htmlFor="role-filter" className="text-sm text-muted-foreground whitespace-nowrap">
                    Role:
                </Label>
                <Select defaultValue="all">
                    <SelectTrigger id="role-filter" className="w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
