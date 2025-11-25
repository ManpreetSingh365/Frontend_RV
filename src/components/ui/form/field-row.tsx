interface FieldRowProps {
    children: React.ReactNode;
}

export function FieldRow({ children }: FieldRowProps) {
    return <div className="grid grid-cols-2 gap-4">{children}</div>;
}
