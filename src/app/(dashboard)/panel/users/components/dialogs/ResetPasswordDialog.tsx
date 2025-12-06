"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { resetPassword } from "@/lib/service/user.service";
import { AlertMessage } from "@/components/ui/alert-message";

interface ResetPasswordDialogProps {
    userId: string;
    userName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onPasswordReset?: () => void;
}

export default function ResetPasswordDialog({
    userId,
    userName,
    open,
    onOpenChange,
    onPasswordReset,
}: ResetPasswordDialogProps) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});

    const resetMutation = useMutation({
        mutationFn: (password: string) => resetPassword(userId, password),
        onSuccess: (response) => {
            toast.success(response.data?.message || "Password reset successfully");
            onOpenChange(false);
            onPasswordReset?.();
            // Reset form
            setNewPassword("");
            setConfirmPassword("");
            setErrors({});
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to reset password");
        },
    });

    const handleSubmit = () => {
        // Validation
        const newErrors: { newPassword?: string; confirmPassword?: string } = {};

        if (!newPassword) {
            newErrors.newPassword = "Password is required";
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm password";
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        resetMutation.mutate(newPassword);
    };

    const handleClose = () => {
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                        Set a new password for <span className="font-medium text-foreground">{userName}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* New Password */}
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">
                            New Password <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    if (errors.newPassword) setErrors({ ...errors, newPassword: undefined });
                                }}
                                placeholder="Enter new password (min. 8 characters)"
                                disabled={resetMutation.isPending}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-sm text-destructive">{errors.newPassword}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            Confirm Password <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                            }}
                            placeholder="Re-enter new password"
                            disabled={resetMutation.isPending}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Info Alert */}
                    <AlertMessage
                        variant="info"
                        message="The user will be able to log in with this new password immediately."
                    />
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={resetMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={resetMutation.isPending}
                    >
                        {resetMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Resetting...
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
