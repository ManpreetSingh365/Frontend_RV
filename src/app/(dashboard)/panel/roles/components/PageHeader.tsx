"use client";

import { Download, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ActionButton } from "@/components/shared/ActionButton";
import AddRoleDialog from "./AddRoleDialog";

interface RolePageHeaderProps {
    onRoleCreated?: () => void;
}

export default function RolePageHeader({ onRoleCreated }: RolePageHeaderProps) {
    return (
        <PageHeader
            title="Role Management"
            actions={
                <>
                    <AddRoleDialog onRoleCreated={onRoleCreated}>
                        <ActionButton icon={Plus} label="Add New Role" shortLabel="Add Role" />
                    </AddRoleDialog>
                    <ActionButton icon={Download} label="Export CSV" shortLabel="Export" variant="outline" />
                </>
            }
        />
    );
}
