interface FieldRowProps {
    children: React.ReactNode;
}

export function FieldRow({ children }: FieldRowProps) {
    return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>;
}
