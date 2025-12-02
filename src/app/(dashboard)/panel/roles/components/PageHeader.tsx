"use client";

import { PageHeader as SharedPageHeader } from "@/components/shared/PageHeader";
import { ActionButton } from "@/components/shared";
import { Plus, Download } from "lucide-react";
import AddRoleDialog from "./dialogs/AddRoleDialog";

interface RolesPageHeaderProps {
    onRoleCreated?: () => void;
}

export default function RolesPageHeader({ onRoleCreated }: RolesPageHeaderProps) {
    return (
        <SharedPageHeader
            title="Role Management"
            actions={
                <div className="flex items-center gap-2">
                    <AddRoleDialog onRoleCreated={onRoleCreated}>
                        <ActionButton
                            icon={Plus}
                            label="Add New Role"
                            shortLabel="Add Role"
                        />
                    </AddRoleDialog>
                    <ActionButton
                        icon={Download}
                        label="Export CSV"
                        shortLabel="Export"
                        variant="outline"
                        onClick={() => {
                            // Implement export functionality
                            console.log("Export roles");
                        }}
                    />
                </div>
            }
        />
    );
}
