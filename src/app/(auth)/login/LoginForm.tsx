'use client';

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/util/utils";
import { loginAction, type LoginFormState } from "@/lib/action/auth.actions";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "@/components/ui/error-message";
import { AlertMessage } from "@/components/ui/alert-message";
import { SubmitButton } from "@/components/ui/submit-button";

/**
 * LoginForm Component - Clean UI Layer
 * Uses useActionState for elegant form handling
 * All logic delegated to clientLoginAction (runs in browser for cookie support)
 */
export function LoginForm({
    className,
}: {
    className?: string;
}) {
    const router = useRouter();
    const [result, formAction] = useActionState<LoginFormState | null, FormData>(loginAction, null);

    // Check if there are any errors
    const hasUsernameError = !!result?.fieldErrors?.username;
    const hasPasswordError = !!result?.fieldErrors?.password;

    // Redirect on successful login
    useEffect(() => {
        if (result?.success) {
            setTimeout(() => {
                router.push("/panel");
            }, 1000);
        }
    }, [result?.success, router]);

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">

                    <form action={formAction} noValidate className="p-6 md:p-8 space-y-5">
                        <FieldGroup>
                            <div className="space-y-4">
                                {/* Title */}
                                <div className="flex flex-col items-center gap-2 text-center mb-2">
                                    <h1 className="text-2xl font-bold">Welcome back 👋</h1>
                                    <p className="text-muted-foreground">
                                        Let's Hit the Road with RouteVision 🚚
                                    </p>
                                </div>

                                {/* Global message (error, success, warning, info) */}
                                <AlertMessage
                                    message={result?.message}
                                    variant={result?.variant || "error"}
                                />

                                {/* Error message */}
                                {/* <AlertMessage message="Login failed" variant="error" /> */}

                                {/* Success message */}
                                {/* <AlertMessage message="Login successful!" variant="success" /> */}

                                {/* Warning message */}
                                {/* <AlertMessage message="Session about to expire" variant="warning" /> */}

                                {/* Info message */}
                                {/* <AlertMessage message="New features available" variant="info" /> */}

                                {/* Username Field */}
                                <Field>
                                    <FieldLabel htmlFor="username">Username 👤</FieldLabel>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        aria-invalid={hasUsernameError}
                                        aria-describedby={hasUsernameError ? "username-error" : undefined}
                                        autoComplete="username"
                                        required
                                    />
                                    <ErrorMessage
                                        id="username-error"
                                        errors={result?.fieldErrors?.username}
                                    />
                                </Field>

                                {/* Password Field */}
                                <Field>
                                    <FieldLabel htmlFor="password">Password 🔒</FieldLabel>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        aria-invalid={hasPasswordError}
                                        aria-describedby={hasPasswordError ? "password-error" : undefined}
                                        autoComplete="current-password"
                                        required
                                    />
                                    <ErrorMessage
                                        id="password-error"
                                        errors={result?.fieldErrors?.password}
                                    />
                                </Field>

                                {/* Remember Me Checkbox */}
                                <Field>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="rememberMe"
                                            className="rounded border-gray-300 text-primary focus:ring-primary"
                                            aria-label="Remember me for 7 days"
                                        />
                                        <span>Remember Me for 7 days</span>
                                    </label>
                                </Field>

                                {/* Submit Button */}
                                <Field>
                                    <SubmitButton loadingText="Logging in..." size="lg">
                                        Login 🚀
                                    </SubmitButton>
                                </Field>
                            </div>
                        </FieldGroup>
                    </form>

                    {/* IMAGE PANEL */}
                    <div className="bg-muted relative hidden md:block">
                        <Image
                            src="/login-image.png"
                            alt="Login Illustration"
                            fill
                            className="object-cover dark:brightness-[0.8]"
                            priority
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Footer */}
            <FieldDescription className="px-6 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <a href="#" className="underline hover:no-underline">
                    Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:no-underline">
                    Privacy Policy
                </a>
                .
            </FieldDescription>
        </div>
    );
}
