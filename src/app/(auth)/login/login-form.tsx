"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginSchema } from "@/lib/valibot/schemas/loginSchema";
import {
  loginAction,
  LoginPayload,
  ServerActionState,
} from "@/app/(auth)/login/_actions/loginAction";
import { safeParse } from "valibot";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe?: boolean;
}

const initialState: ServerActionState = {
  success: false,
  errors: {},
  message: "",
};

export function LoginForm({ className }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [formState, setFormState] = useState<ServerActionState>(initialState);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = (values: LoginFormValues) => {
    // Client-side validation
    const parsed = safeParse(loginSchema, values);

    if (!parsed.success) {
      parsed.issues?.forEach((issue) => {
        const key = issue.path?.[0] as unknown as keyof LoginFormValues;
        if (key) {
          setError(key, { message: issue.message });
        }
      });
      return;
    }

    const output: LoginPayload = parsed.output;

    // Call server action
    startTransition(async () => {
      try {
        const result = await loginAction(output);

        console.log("🔄 Server action result:", result); // Debug log

        // Handle server validation errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, message]) => {
            setError(field as keyof LoginFormValues, { message });
          });
        }

        setFormState(result);

        // Note: If login is successful, loginAction will handle redirect
        // No manual redirect needed here since we use redirect() in server action
      } catch (error) {
        console.error("❌ Form submission error:", error);
        setFormState({
          success: false,
          errors: {},
          message: "An unexpected error occurred. Please try again.",
        });
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center mb-6">
                <h1 className="text-2xl font-bold">Welcome back 👋</h1>
                <p className="text-muted-foreground text-balance">
                  Let's Hit the Road with RouteVision 🚚
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="username">Username 👤</FieldLabel>
                <Input
                  id="username"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  placeholder="Enter your username"
                  disabled={isPending}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password 🔒</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  placeholder="Enter your password"
                  disabled={isPending}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </Field>

              <Field>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    disabled={isPending}
                  />
                  Remember Me
                </label>
              </Field>

              {/* Show error messages */}
              {formState.message && !formState.success && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm text-center">
                    {formState.message}
                  </p>
                </div>
              )}

              {/* Show success message briefly */}
              {formState.success && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-green-600 text-sm text-center">
                    Login successful! Redirecting...
                  </p>
                </div>
              )}

              <Field>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Logging in...
                    </div>
                  ) : (
                    "Login 🚀"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <Image
              src="/login-image.png"
              alt="Login Image"
              fill
              className="object-cover dark:brightness-[0.2] dark:grayscale"
              priority
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
