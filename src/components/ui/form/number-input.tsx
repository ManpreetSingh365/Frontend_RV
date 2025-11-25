import { forwardRef } from "react";
import { Input } from "@/components/ui/input";

interface NumberInputProps extends Omit<React.ComponentProps<"input">, "type" | "onChange"> {
    value?: number;
    onChange?: (value: number | undefined) => void;
    min?: number;
    max?: number;
    step?: number;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    ({ value, onChange, min = 0, max, step = 1, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;
            onChange?.(inputValue === "" ? undefined : Number(inputValue));
        };

        return (
            <Input
                ref={ref}
                type="number"
                min={min}
                max={max}
                step={step}
                value={value ?? ""}
                onChange={handleChange}
                {...props}
            />
        );
    }
);

NumberInput.displayName = "NumberInput";
