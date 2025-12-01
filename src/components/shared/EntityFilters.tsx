import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface FilterConfig {
    type: "search" | "select";
    key: string;
    label: string;
    placeholder: string;
    options?: Array<{ value: string; label: string }>;
}

interface EntityFiltersProps {
    filters: FilterConfig[];
    values: Record<string, string>;
    onChange: (key: string, value: string) => void;
}

export function EntityFilters({ filters, values, onChange }: EntityFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {filters.map((filter) => {
                if (filter.type === "search") {
                    return (
                        <div key={filter.key} className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={filter.placeholder}
                                value={values[filter.key] || ""}
                                onChange={(e) => onChange(filter.key, e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    );
                }

                if (filter.type === "select") {
                    return (
                        <Select
                            key={filter.key}
                            value={values[filter.key] || "all"}
                            onValueChange={(value) => onChange(filter.key, value)}
                        >
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder={filter.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All {filter.label}s</SelectItem>
                                {filter.options?.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    );
                }

                return null;
            })}
        </div>
    );
}
