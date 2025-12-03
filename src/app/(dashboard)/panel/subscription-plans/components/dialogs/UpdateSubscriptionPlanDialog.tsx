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
import { getSubscriptionPlanById, updateSubscriptionPlan } from "@/lib/service/subscription-plan.service";
import { SubscriptionPlanForm, SubscriptionPlanFormValues } from "../forms/SubscriptionPlanForm";
import { QUERY_KEYS } from "@/lib/hooks";
import { LoadingState } from "@/components/ui/loading-state";

interface UpdateSubscriptionPlanDialogProps {
    planId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onPlanUpdated?: () => void;
}

export default function UpdateSubscriptionPlanDialog({
    planId,
    open,
    onOpenChange,
    onPlanUpdated,
}: UpdateSubscriptionPlanDialogProps) {
    const queryClient = useQueryClient();
    const [formValues, setFormValues] = useState<SubscriptionPlanFormValues>({
        name: "",
        amount: 0,
        durationDays: 30,
        features: [],
        active: true,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof SubscriptionPlanFormValues, string>>>({});

    // Fetch plan data
    const { data, isLoading } = useQuery({
        queryKey: [...QUERY_KEYS.subscriptionPlans, planId],
        queryFn: () => getSubscriptionPlanById(planId),
        enabled: open && !!planId,
    });

    // Update form values when data is loaded
    useEffect(() => {
        if (data?.data) {
            setFormValues({
                name: data.data.name || "",
                amount: data.data.amount || 0,
                durationDays: data.data.durationDays || 30,
                features: data.data.features || [],
                active: data.data.active !== false,
            });
        }
    }, [data]);

    const updateMutation = useMutation({
        mutationFn: (payload: any) => updateSubscriptionPlan(planId, payload),
        onSuccess: () => {
            toast.success("Subscription plan updated successfully");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subscriptionPlans });
            onOpenChange(false);
            onPlanUpdated?.();
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to update subscription plan");
        },
    });

    const handleSubmit = () => {
        // Basic validation
        const newErrors: Partial<Record<keyof SubscriptionPlanFormValues, string>> = {};
        if (!formValues.name) newErrors.name = "Name is required";
        if (formValues.amount <= 0) newErrors.amount = "Amount must be positive";
        if (formValues.durationDays < 1) newErrors.durationDays = "Duration must be at least 1 day";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        updateMutation.mutate({
            name: formValues.name,
            amount: formValues.amount,
            durationDays: formValues.durationDays,
            features: formValues.features || [],
            active: formValues.active,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Subscription Plan</DialogTitle>
                    <DialogDescription>
                        Update subscription plan details. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <LoadingState message="Loading plan..." />
                ) : (
                    <SubscriptionPlanForm
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
