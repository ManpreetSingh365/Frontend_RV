// components/client-login-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { safeParse } from "valibot";
import { loginSchema } from "@/lib/valibot/schemas/loginSchema";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  message: string;
}

export function ClientLoginForm({ className }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    // ✅ Client-side validation with Valibot
    const parsed = safeParse(loginSchema, values);
    if (!parsed.success) {
      parsed.issues?.forEach((issue) => {
        const key = issue.path?.[0] as unknown as keyof LoginFormValues;
        if (key) {
          setFormError(key, { type: "manual", message: issue.message });
        }
      });
      setLoading(false);
      return;
    }

    try {
      // Call backend (Spring Boot sets HTTP-only cookie)
      await apiClient.post<LoginFormValues, LoginResponse>(
        "/portal/auth/login",
        parsed.output
      );

      setSuccess(true);

      // ✅ Keep loading until redirect
      setTimeout(() => {
        router.push("/admin/panel"); // redirect to admin panel
      }, 500); // optional small UX delay
    } catch (err: any) {
      setError(
        err?.response?.message || "Login failed. Please check your credentials."
      );
      setLoading(false); // stop spinner on error
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center mb-2">
                <h1 className="text-2xl font-bold">Welcome back 👋</h1>
                <p className="text-muted-foreground">
                  Let's Hit the Road with RouteVision 🚚
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 text-center text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 text-center text-green-600 text-sm">
                  ✅ Login successful! Redirecting...
                </div>
              )}

              {/* Username */}
              <Field>
                <FieldLabel htmlFor="username">Username 👤</FieldLabel>
                <Input
                  id="username"
                  {...register("username")}
                  placeholder="Enter your username"
                  disabled={loading}
                  aria-invalid={!!errors.username}
                  aria-describedby="username-error"
                  autoComplete="username"
                />
                {errors.username && (
                  <p id="username-error" className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password">Password 🔒</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Enter your password"
                  disabled={loading}
                  aria-invalid={!!errors.password}
                  aria-describedby="password-error"
                  autoComplete="current-password"
                />
                {errors.password && (
                  <p id="password-error" className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </Field>

              {/* Remember Me */}
              <Field>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    disabled={loading}
                    className="rounded border-gray-300"
                  />
                  <span>Remember Me for 7 days</span>
                </label>
              </Field>

              {/* Submit button */}
              <Field>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2 justify-center">
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

          {/* Side image */}
          <div className="bg-muted relative hidden md:block">
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
