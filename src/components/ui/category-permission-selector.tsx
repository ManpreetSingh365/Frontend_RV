"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    formatCategoryName,
    formatPermissionName,
    getCategorySelectionState,
    toggleCategoryPermissions,
    type PermissionCategory
} from "@/lib/util/permission-utils";
import { CheckCircle2, Circle, Shield } from "lucide-react";
import { cn } from "@/lib/util/utils";

interface CategoryPermissionSelectorProps {
    categories: PermissionCategory[];
    selectedPermissions: string[];
    onChange: (permissions: string[]) => void;
    disabled?: boolean;
}

export function CategoryPermissionSelector({
    categories,
    selectedPermissions,
    onChange,
    disabled = false,
}: CategoryPermissionSelectorProps) {
    const handleTogglePermission = (permission: string) => {
        if (disabled) return;

        const isSelected = selectedPermissions.includes(permission);
        const newPermissions = isSelected
            ? selectedPermissions.filter(p => p !== permission)
            : [...selectedPermissions, permission];

        onChange(newPermissions);
    };

    const handleToggleCategory = (category: PermissionCategory) => {
        if (disabled) return;

        const state = getCategorySelectionState(category.permissions, selectedPermissions);
        const selectAll = state !== 'all';

        const newPermissions = toggleCategoryPermissions(
            category.permissions,
            selectedPermissions,
            selectAll
        );

        onChange(newPermissions);
    };

    if (categories.length === 0) {
        return (
            <Card className="p-8 text-center border-dashed">
                <Shield className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No permissions available</p>
            </Card>
        );
    }

    return (
        <ScrollArea className="h-[600px] pr-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {categories.map((category) => {
                    const selectionState = getCategorySelectionState(
                        category.permissions,
                        selectedPermissions
                    );
                    const selectedCount = category.permissions.filter(p =>
                        selectedPermissions.includes(p)
                    ).length;
                    const hasSelection = selectedCount > 0;
                    const isAllSelected = selectionState === 'all';

                    return (
                        <Card
                            key={category.category}
                            className={cn(
                                "group relative transition-all duration-300 overflow-hidden",
                                hasSelection
                                    ? "border-primary/50 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent shadow-md hover:shadow-lg"
                                    : "border-border/60 hover:border-primary/30 hover:shadow-md bg-card/50 backdrop-blur-sm"
                            )}
                        >
                            {/* Category Header */}
                            <CardHeader className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div
                                        className="flex items-center gap-3 flex-1 cursor-pointer select-none group/header"
                                        onClick={() => handleToggleCategory(category)}
                                    >
                                        <div className={cn(
                                            "flex-shrink-0 transition-all duration-300 transform group-hover/header:scale-110",
                                            isAllSelected ? "text-primary" : "text-muted-foreground"
                                        )}>
                                            {isAllSelected ? (
                                                <CheckCircle2 className="h-5 w-5" />
                                            ) : (
                                                <Circle className={cn(
                                                    "h-5 w-5",
                                                    hasSelection && "text-primary/70"
                                                )} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={cn(
                                                "font-bold text-base tracking-tight",
                                                hasSelection ? "text-primary" : "text-foreground"
                                            )}>
                                                {formatCategoryName(category.category)}
                                            </h4>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {selectedCount} of {category.permissions.length} selected
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={hasSelection ? "default" : "outline"}
                                        className={cn(
                                            "ml-2 text-xs font-semibold transition-all duration-300",
                                            hasSelection ? "bg-primary/90" : ""
                                        )}
                                    >
                                        {selectedCount}/{category.permissions.length}
                                    </Badge>
                                </div>
                            </CardHeader>

                            {/* Permissions Chips */}
                            <CardContent className="pt-0">
                                <div className="flex flex-wrap gap-1.5">
                                    {category.permissions.map((permission) => {
                                        const isSelected = selectedPermissions.includes(permission);
                                        return (
                                            <Badge
                                                key={permission}
                                                variant={isSelected ? "default" : "outline"}
                                                className={cn(
                                                    "cursor-pointer select-none transition-all duration-200 text-[11px] px-2.5 py-1 font-medium",
                                                    isSelected
                                                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm border-primary"
                                                        : "bg-background/50 hover:bg-muted hover:border-primary/40 hover:text-foreground border-border/60",
                                                    disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                                                )}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTogglePermission(permission);
                                                }}
                                            >
                                                {formatPermissionName(permission)}
                                            </Badge>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </ScrollArea>
    );
}
