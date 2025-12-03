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
import { createSubscriptionPlan } from "@/lib/service/subscription-plan.service";
import { SubscriptionPlanForm, SubscriptionPlanFormValues } from "../forms/SubscriptionPlanForm";
import { QUERY_KEYS } from "@/lib/hooks";

interface AddSubscriptionPlanDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onPlanCreated?: () => void;
}

export default function AddSubscriptionPlanDialog({
    open,
    onOpenChange,
    onPlanCreated,
}: AddSubscriptionPlanDialogProps) {
    const queryClient = useQueryClient();
    const [formValues, setFormValues] = useState<SubscriptionPlanFormValues>({
        name: "",
        amount: 0,
        durationDays: 30,
        features: [],
    });
    const [errors, setErrors] = useState<Partial<Record<keyof SubscriptionPlanFormValues, string>>>({});

    const createMutation = useMutation({
        mutationFn: createSubscriptionPlan,
        onSuccess: () => {
            toast.success("Subscription plan created successfully");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subscriptionPlans });
            onOpenChange(false);
            onPlanCreated?.();
            // Reset form
            setFormValues({
                name: "",
                amount: 0,
                durationDays: 30,
                features: [],
            });
            setErrors({});
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to create subscription plan");
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

        createMutation.mutate({
            name: formValues.name,
            amount: formValues.amount,
            durationDays: formValues.durationDays,
            features: formValues.features || [],
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Subscription Plan</DialogTitle>
                    <DialogDescription>
                        Create a new subscription plan. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <SubscriptionPlanForm
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
                        {createMutation.isPending ? "Creating..." : "Create Plan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
