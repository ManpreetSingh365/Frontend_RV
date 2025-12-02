"use client";

import { PageHeader as SharedPageHeader } from "@/components/shared/PageHeader";
import { ActionButton } from "@/components/shared";
import { Plus, Download } from "lucide-react";
import AddUserDialog from "./dialogs/AddUserDialog";

interface UsersPageHeaderProps {
  onUserCreated?: () => void;
}

export default function UsersPageHeader({ onUserCreated }: UsersPageHeaderProps) {
  return (
    <SharedPageHeader
      title="User Management"
      actions={
        <div className="flex items-center gap-2">
          <AddUserDialog onUserCreated={onUserCreated}>
            <ActionButton
              icon={Plus}
              label="Add New User"
              shortLabel="Add User"
            />
          </AddUserDialog>
          <ActionButton
            icon={Download}
            label="Export CSV"
            shortLabel="Export"
            variant="outline"
            onClick={() => {
              // Implement export functionality
              console.log("Export users");
            }}
          />
        </div>
      }
    />
  );
}
