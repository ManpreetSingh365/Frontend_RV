import { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    actions?: ReactNode;
}

export function PageHeader({ title, actions }: PageHeaderProps) {
    return (
        <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">{title}</h1>
            {actions && <div className="flex items-center gap-2 sm:gap-3">{actions}</div>}
        </div>
    );
}
