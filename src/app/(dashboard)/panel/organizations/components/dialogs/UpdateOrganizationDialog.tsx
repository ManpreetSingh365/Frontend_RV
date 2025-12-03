"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getOrganizationById, updateOrganization } from "@/lib/service/organization.service";
import { OrganizationForm, OrganizationFormValues } from "../forms/OrganizationForm";
import { QUERY_KEYS } from "@/lib/hooks";
import { LoadingState } from "@/components/ui/loading-state";

interface UpdateOrganizationDialogProps {
    organizationId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onOrganizationUpdated?: () => void;
}

export default function UpdateOrganizationDialog({
    organizationId,
    open,
    onOpenChange,
    onOrganizationUpdated,
}: UpdateOrganizationDialogProps) {
    const queryClient = useQueryClient();
    const [formValues, setFormValues] = useState<OrganizationFormValues>({
        name: "",
        domain: "",
        description: "",
        settings: "",
        active: true,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof OrganizationFormValues, string>>>({});

    // Fetch organization data
    const { data, isLoading } = useQuery({
        queryKey: [...QUERY_KEYS.organizations, organizationId],
        queryFn: () => getOrganizationById(organizationId),
        enabled: open && !!organizationId,
    });

    // Update form values when data is loaded
    useEffect(() => {
        if (data?.data) {
            setFormValues({
                name: data.data.name || "",
                domain: data.data.domain || "",
                description: data.data.description || "",
                settings: data.data.settings || "",
                active: data.data.active !== false,
            });
        }
    }, [data]);

    const updateMutation = useMutation({
        mutationFn: (payload: any) => updateOrganization(organizationId, payload),
        onSuccess: () => {
            toast.success("Organization updated successfully");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.organizations });
            onOpenChange(false);
            onOrganizationUpdated?.();
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to update organization");
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

        updateMutation.mutate({
            name: formValues.name,
            domain: formValues.domain,
            description: formValues.description,
            settings: formValues.settings,
            active: formValues.active,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Organization</DialogTitle>
                    <DialogDescription>
                        Update organization details. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <LoadingState message="Loading organization..." />
                ) : (
                    <OrganizationForm
                        values={formValues}
                        onChange={setFormValues}
                        errors={errors}
                        showActiveToggle
                    />
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={updateMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={updateMutation.isPending || isLoading}>
                        {updateMutation.isPending ? "Updating..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
