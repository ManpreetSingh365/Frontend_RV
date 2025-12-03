"use client";

import { useState } from "react";
import { Filter, Plus, X, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { FilterCondition, FilterOperator } from "@/lib/utils/filter-utils";
import { getOperatorLabel, getOperatorsForType } from "@/lib/utils/filter-utils";
import type { ColumnDef } from "@/lib/types/entity";

interface AdvancedFilterDialogProps {
    columns: ColumnDef<any>[];
    conditions: FilterCondition[];
    logic: "AND" | "OR";
    onConditionsChange: (conditions: FilterCondition[]) => void;
    onLogicChange: (logic: "AND" | "OR") => void;
    onApply: () => void;
    presets?: Array<{ name: string; conditions: FilterCondition[]; logic: "AND" | "OR" }>;
    onSavePreset?: (name: string) => void;
    onLoadPreset?: (name: string) => void;
    onDeletePreset?: (name: string) => void;
    trigger?: React.ReactNode;
}

export function AdvancedFilterDialog({
    columns,
    conditions,
    logic,
    onConditionsChange,
    onLogicChange,
    onApply,
    presets = [],
    onSavePreset,
    onLoadPreset,
    onDeletePreset,
    trigger,
}: AdvancedFilterDialogProps) {
    const [open, setOpen] = useState(false);
    const [presetName, setPresetName] = useState("");

    // Filter out system columns
    const filterableColumns = columns.filter(
        (col) => col.id && !["selection", "actions"].includes(col.id)
    );

    const addCondition = () => {
        const newCondition: FilterCondition = {
            id: `condition-${Date.now()}`,
            field: filterableColumns[0]?.id || "",
            operator: "contains",
            value: "",
        };
        onConditionsChange([...conditions, newCondition]);
    };

    const removeCondition = (id: string) => {
        onConditionsChange(conditions.filter((c) => c.id !== id));
    };

    const updateCondition = (id: string, updates: Partial<FilterCondition>) => {
        onConditionsChange(
            conditions.map((c) => (c.id === id ? { ...c, ...updates } : c))
        );
    };

    const handleApply = () => {
        onApply();
        setOpen(false);
    };

    const handleSavePreset = () => {
        if (presetName.trim() && onSavePreset) {
            onSavePreset(presetName.trim());
            setPresetName("");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="h-9 gap-2">
                        <Filter className="h-4 w-4" />
                        <span className="hidden sm:inline">Advanced Filters</span>
                        {conditions.length > 0 && (
                            <Badge variant="secondary" className="ml-1 px-1.5 py-0">
                                {conditions.length}
                            </Badge>
                        )}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Advanced Filters</DialogTitle>
                    <DialogDescription>
                        Create complex filters with multiple conditions
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Logic Selector */}
                    {conditions.length > 1 && (
                        <div className="space-y-2">
                            <Label>Match Logic</Label>
                            <RadioGroup value={logic} onValueChange={(val: string) => onLogicChange(val as "AND" | "OR")}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="AND" id="and" />
                                    <Label htmlFor="and" className="font-normal cursor-pointer">
                                        Match <strong>all</strong> conditions (AND)
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="OR" id="or" />
                                    <Label htmlFor="or" className="font-normal cursor-pointer">
                                        Match <strong>any</strong> condition (OR)
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    )}

                    <Separator />

                    {/* Filter Conditions */}
                    <div className="space-y-3">
                        {conditions.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Filter className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">No filter conditions yet</p>
                                <p className="text-xs">Click "Add Condition" to get started</p>
                            </div>
                        ) : (
                            conditions.map((condition, index) => (
                                <div key={condition.id} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/30">
                                    <div className="flex-1 grid grid-cols-3 gap-2">
                                        {/* Field */}
                                        <div className="space-y-1">
                                            <Label className="text-xs">Field</Label>
                                            <Select
                                                value={condition.field}
                                                onValueChange={(val) => updateCondition(condition.id, { field: val })}
                                            >
                                                <SelectTrigger className="h-9">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filterableColumns.map((col) => (
                                                        <SelectItem key={col.id} value={col.id!}>
                                                            {typeof col.header === "string" ? col.header : col.id}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Operator */}
                                        <div className="space-y-1">
                                            <Label className="text-xs">Operator</Label>
                                            <Select
                                                value={condition.operator}
                                                onValueChange={(val) =>
                                                    updateCondition(condition.id, { operator: val as FilterOperator })
                                                }
                                            >
                                                <SelectTrigger className="h-9">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {getOperatorsForType("string").map((op) => (
                                                        <SelectItem key={op} value={op}>
                                                            {getOperatorLabel(op)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Value */}
                                        {!["isEmpty", "isNotEmpty"].includes(condition.operator) && (
                                            <div className="space-y-1">
                                                <Label className="text-xs">Value</Label>
                                                <Input
                                                    value={condition.value || ""}
                                                    onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                                                    placeholder="Enter value..."
                                                    className="h-9"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Remove Button */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeCondition(condition.id)}
                                        className="h-9 w-9 mt-5"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>

                    <Button onClick={addCondition} variant="outline" size="sm" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Condition
                    </Button>

                    {/* Presets */}
                    {(presets.length > 0 || onSavePreset) && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <Label>Filter Presets</Label>
                                {presets.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {presets.map((preset) => (
                                            <div key={preset.name} className="flex items-center gap-1">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onLoadPreset?.(preset.name)}
                                                    className="h-7"
                                                >
                                                    {preset.name}
                                                </Button>
                                                {onDeletePreset && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => onDeletePreset(preset.name)}
                                                        className="h-7 w-7"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {onSavePreset && conditions.length > 0 && (
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Preset name..."
                                            value={presetName}
                                            onChange={(e) => setPresetName(e.target.value)}
                                            className="h-8"
                                        />
                                        <Button
                                            onClick={handleSavePreset}
                                            disabled={!presetName.trim()}
                                            size="sm"
                                            className="h-8"
                                        >
                                            <Save className="h-3.5 w-3.5 mr-1" />
                                            Save
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onConditionsChange([])}>
                        Clear All
                    </Button>
                    <Button onClick={handleApply}>
                        Apply Filters
                        {conditions.length > 0 && ` (${conditions.length})`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
