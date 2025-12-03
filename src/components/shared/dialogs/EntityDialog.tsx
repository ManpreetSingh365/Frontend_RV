// import { ReactNode } from "react";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { useDialogState } from "@/hooks/use-dialog-state";

// interface EntityDialogProps {
//     trigger?: ReactNode;
//     title: string;
//     description?: string;
//     children: (props: {
//         onCancel: () => void;
//     }) => ReactNode;
//     open?: boolean;
//     onOpenChange?: (open: boolean) => void;
//     maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
// }

// export function EntityDialog({
//     trigger,
//     title,
//     description,
//     children,
//     open: controlledOpen,
//     onOpenChange: controlledOnOpenChange,
//     maxWidth = "lg"
// }: EntityDialogProps) {
//     const { open, setOpen } = useDialogState({
//         open: controlledOpen,
//         onOpenChange: controlledOnOpenChange
//     });

//     const maxWidthClasses = {
//         sm: "sm:max-w-[425px]",
//         md: "sm:max-w-[600px]",
//         lg: "sm:max-w-[800px]",
//         xl: "sm:max-w-[1000px]",
//         "2xl": "sm:max-w-[1200px]"
//     };

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
//             <DialogContent className={`max-h-[90vh] overflow-y-auto ${maxWidthClasses[maxWidth]}`}>
//                 <DialogHeader>
//                     <DialogTitle>{title}</DialogTitle>
//                     {description && <DialogDescription>{description}</DialogDescription>}
//                 </DialogHeader>
//                 {children({ onCancel: () => setOpen(false) })}
//             </DialogContent>
//         </Dialog>
//     );
// }
