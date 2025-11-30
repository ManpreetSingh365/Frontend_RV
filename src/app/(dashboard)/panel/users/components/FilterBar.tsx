"use client";

import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DebouncedInput } from "@/components/ui/debounced-input";
import { Search } from "lucide-react";
import { useUserData } from "../providers/data-provider";

interface FilterBarProps {
    searchTerm: string;
    onSearchChange: (search: string) => void;
    selectedRole: string;
    onRoleChange: (role: string) => void;
}

export default function FilterBar({ searchTerm, onSearchChange, selectedRole, onRoleChange }: FilterBarProps) {
    // Use centralized data from context - NO redundant API calls!
    const { roles, loading } = useUserData();
    return (
        <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4 mb-4 sm:mb-6">
            {/* Search Bar - Full Width on Mobile */}
            <div className="relative flex-1 w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                <DebouncedInput
                    type="text"
                    placeholder="Search by name, username, or mobile..."
                    value={searchTerm}
                    onChange={onSearchChange}
                    debounceMs={1000}
                    showClearButton
                    className="pl-10 h-9 sm:h-10 text-sm shadow-sm focus:shadow-md transition-shadow"
                />
            </div>

            {/* Filters Row - Inline on Mobile */}
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial min-w-0">
                    <Label htmlFor="role-filter" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap shrink-0 font-medium">
                        Role:
                    </Label>
                    <Select value={selectedRole} onValueChange={onRoleChange} disabled={loading}>
                        <SelectTrigger
                            id="role-filter"
                            className="h-9 sm:h-10 w-full sm:w-32 text-xs sm:text-sm shadow-sm hover:shadow-md transition-shadow"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {roles.map((role) => (
                                <SelectItem key={role.id} value={role.name}>
                                    {role.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial min-w-0">
                    <Label htmlFor="status-filter" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap shrink-0 font-medium">
                        Status:
                    </Label>
                    <Select defaultValue="all">
                        <SelectTrigger
                            id="status-filter"
                            className="h-9 sm:h-10 w-full sm:w-32 text-xs sm:text-sm shadow-sm hover:shadow-md transition-shadow"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
