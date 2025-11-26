"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/util/utils";

interface PasswordInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
    value?: string;
    onChange: (value: string) => void;
    defaultPassword?: string;
}

export function PasswordInput({
    value,
    onChange,
    placeholder,
    defaultPassword = "abcdef",
    className,
    ...props
}: PasswordInputProps) {
    const [isDefault, setIsDefault] = React.useState(!value || value === defaultPassword);

    React.useEffect(() => {
        if (isDefault && value !== defaultPassword) {
            onChange(defaultPassword);
        }
    }, [isDefault, value, onChange, defaultPassword]);

    const handleCheckboxChange = (checked: boolean) => {
        setIsDefault(checked);
        if (checked) {
            onChange(defaultPassword);
        } else {
            onChange("");
        }
    };

    return (
        <div className={cn("space-y-3", className)}>
            <div className="relative">
                <Input
                    type="password"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={isDefault}
                    className={cn(isDefault && "text-muted-foreground")}
                    {...props}
                />
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="use-default-password"
                    checked={isDefault}
                    onCheckedChange={handleCheckboxChange}
                />
                <Label
                    htmlFor="use-default-password"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Use default password
                </Label>
            </div>
        </div>
    );
}
