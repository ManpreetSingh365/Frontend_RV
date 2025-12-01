import { useState, useEffect } from "react";

interface UseDialogStateOptions {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onClose?: () => void;
}

export function useDialogState({
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
    onClose
}: UseDialogStateOptions = {}) {
    const [internalOpen, setInternalOpen] = useState(false);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const setOpen = (value: boolean) => {
        if (!isControlled) {
            setInternalOpen(value);
        }
        controlledOnOpenChange?.(value);

        if (!value && onClose) {
            onClose();
        }
    };

    return {
        open,
        setOpen
    };
}
