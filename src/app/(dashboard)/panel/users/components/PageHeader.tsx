"use client";

import { Button } from "@/components/ui/button";
import { Download, Grid3x3, Plus } from "lucide-react";
import AddUserDialog from "./AddUserDialog";

interface PageHeaderProps {
  onUserCreated?: () => void;
}

export default function PageHeader({ onUserCreated }: PageHeaderProps) {
  return (
    <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between mb-4 sm:mb-6 md:mb-8">
      <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
        User Management
      </h1>
      <div className="flex items-center gap-2 sm:gap-3">
        <AddUserDialog onUserCreated={onUserCreated}>
          <Button
            variant="default"
            size="default"
            className="flex-1 sm:flex-initial sm:w-auto justify-center text-xs sm:text-sm md:text-base h-9 sm:h-10 px-3 sm:px-4 font-medium shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Plus className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden min-[375px]:inline">Add New User</span>
            <span className="min-[375px]:hidden">Add User</span>
          </Button>
        </AddUserDialog>

        <Button
          variant="outline"
          size="default"
          className="flex-1 sm:flex-initial sm:w-auto justify-center text-xs sm:text-sm md:text-base h-9 sm:h-10 px-3 sm:px-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <Download className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden min-[375px]:inline">Export CSV</span>
          <span className="min-[375px]:hidden">Export</span>
        </Button>
      </div>
    </div>
  );
}
