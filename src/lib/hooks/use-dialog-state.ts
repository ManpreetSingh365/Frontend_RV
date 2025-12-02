import { useState, useCallback } from "react";

/**
 * Hook to manage dialog/modal open/close state
 * 
 * @example
 * const dialog = useDialogState();
 * <Dialog open={dialog.isOpen} onOpenChange={dialog.toggle}>
 *   <Button onClick={dialog.open}>Open</Button>
 * </Dialog>
 * 
 * @param initialState - Initial open state (default: false)
 * @param onOpenChange - Optional callback when state changes
 */
export function useDialogState(
    initialState = false,
    onOpenChange?: (isOpen: boolean) => void
) {
    const [isOpen, setIsOpen] = useState(initialState);

    const open = useCallback(() => {
        setIsOpen(true);
        onOpenChange?.(true);
    }, [onOpenChange]);

    const close = useCallback(() => {
        setIsOpen(false);
        onOpenChange?.(false);
    }, [onOpenChange]);

    const toggle = useCallback(() => {
        setIsOpen((prev) => {
            const newState = !prev;
            onOpenChange?.(newState);
            return newState;
        });
    }, [onOpenChange]);

    return { isOpen, open, close, toggle };
}
