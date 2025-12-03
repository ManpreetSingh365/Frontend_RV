"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createOrganization } from "@/lib/service/organization.service";
import { OrganizationForm, OrganizationFormValues } from "../forms/OrganizationForm";
import { QUERY_KEYS } from "@/lib/hooks";

interface AddOrganizationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onOrganizationCreated?: () => void;
}

export default function AddOrganizationDialog({
    open,
    onOpenChange,
    onOrganizationCreated,
}: AddOrganizationDialogProps) {
    const queryClient = useQueryClient();
    const [formValues, setFormValues] = useState<OrganizationFormValues>({
        name: "",
        domain: "",
        description: "",
        settings: "",
    });
    const [errors, setErrors] = useState<Partial<Record<keyof OrganizationFormValues, string>>>({});

    const createMutation = useMutation({
        mutationFn: createOrganization,
        onSuccess: () => {
            toast.success("Organization created successfully");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.organizations });
            onOpenChange(false);
            onOrganizationCreated?.();
            // Reset form
            setFormValues({
                name: "",
                domain: "",
                description: "",
                settings: "",
            });
            setErrors({});
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to create organization");
        },
    });

    const handleSubmit = () => {
        // Basic validation
        const newErrors: Partial<Record<keyof OrganizationFormValues, string>> = {};
        if (!formValues.name) newErrors.name = "Name is required";
        if (!formValues.domain) newErrors.domain = "Domain is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        createMutation.mutate({
            name: formValues.name,
            domain: formValues.domain,
            description: formValues.description,
            settings: formValues.settings,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Organization</DialogTitle>
                    <DialogDescription>
                        Create a new organization. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <OrganizationForm
                    values={formValues}
                    onChange={setFormValues}
                    errors={errors}
                />

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={createMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Creating..." : "Create Organization"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
