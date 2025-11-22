'use client';

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { loginAction } from "@/lib/action/auth.actions";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldDescription,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginResult } from "@/lib/type/LoginResult";

// Submit button component that uses useFormStatus
function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full"
            size="lg"
        >
            {
                pending ? (
                    <div className="flex items-center gap-2 justify-center" >
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"> </div>
                        Logging in...
                    </div>
                ) : (
                    "Login 🚀"
                )}
        </Button>
    );
}

export function LoginForm({
    className,
}: {
    className?: string;
}) {
    const [result, formAction] = useActionState<LoginResult | null, FormData>(loginAction, null);
    const { pending } = useFormStatus();

    return (
        <div className={cn("flex flex-col gap-6", className)} >
            <Card className="overflow-hidden p-0" >
                <CardContent className="grid p-0 md:grid-cols-2" >

                    {/* FORM */}
                    < form action={formAction} className="p-6 md:p-8 space-y-5" >
                        <FieldGroup>

                            {/* Title */}
                            < div className="flex flex-col items-center gap-2 text-center mb-2" >
                                <h1 className="text-2xl font-bold" > Welcome back 👋</h1>
                                < p className="text-muted-foreground" >
                                    Let's Hit the Road with RouteVision 🚚
                                </p>
                            </div>

                            {/* Global error */}
                            {
                                result?.message && (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-3 text-center text-red-600 text-sm" >
                                        {result.message}
                                    </div>
                                )
                            }

                            {/* Username */}
                            <Field>
                                <FieldLabel htmlFor="username">Username 👤</FieldLabel>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    disabled={pending}
                                    placeholder="Enter your username"
                                    aria-invalid={!!result?.fieldErrors?.username}
                                    autoComplete="username"
                                    required
                                />
                                {result?.fieldErrors?.username && (
                                    <p id="username-error" className="text-red-500 text-sm mt-1">
                                        {result.fieldErrors.username[0]}
                                    </p>
                                )}
                            </Field>

                            {/* Password */}
                            <Field>
                                <FieldLabel htmlFor="password" > Password 🔒</FieldLabel>
                                < Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    disabled={pending}
                                    placeholder="Enter your password"
                                    aria-invalid={!!result?.fieldErrors?.password}
                                    autoComplete="current-password"
                                    required
                                />
                                {result?.fieldErrors?.password && (
                                    <p className="text-red-500 text-sm mt-1" >
                                        {result.fieldErrors.password[0]}
                                    </p>
                                )}
                            </Field>

                            {/* Remember Me */}
                            <Field>
                                <label className="flex items-center gap-2 text-sm" >
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        className="rounded border-gray-300"
                                    />
                                    <span>Remember Me for 7 days </span>
                                </label>
                            </Field>

                            {/* Button */}
                            < Field >
                                <SubmitButton />
                            </Field>

                        </FieldGroup>
                    </form>

                    {/* IMAGE PANEL */}
                    <div className="bg-muted relative hidden md:block" >
                        <Image
                            src="/login-image.png"
                            alt="Login Illustration"
                            fill
                            className="object-cover dark:brightness-[0.2] dark:grayscale"
                            priority
                        />
                    </div>

                </CardContent>
            </Card>

            {/* Footer */}
            <FieldDescription className="px-6 text-center text-sm text-muted-foreground" >
                By clicking continue, you agree to our{" "}
                <a href="#" className="underline hover:no-underline" >
                    Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:no-underline" >
                    Privacy Policy
                </a>
                .
            </FieldDescription>
        </div>
    );
}
