"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { safeParse } from "valibot";
import { loginSchema } from "@/lib/valibot/schemas/loginSchema";
import { env } from "@/lib/env";
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
import Image from "next/image";

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function ClientLoginForm({ className }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [state, setState] = useState<LoginState>({
    loading: false,
    error: null,
    success: false,
  });

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = async (values: LoginFormValues) => {
    // Clear previous state
    clearErrors();
    setState({ loading: true, error: null, success: false });

    // ✅ Client-side validation
    const parsed = safeParse(loginSchema, values);
    if (!parsed.success) {
      parsed.issues?.forEach((issue) => {
        const key = issue.path?.[0] as unknown as keyof LoginFormValues;
        if (key) {
          setError(key, { message: issue.message });
        }
      });
      setState({ loading: false, error: null, success: false });
      return;
    }

    try {
      console.log("🔐 Client: Starting login process");

      // ✅ Direct call to Route Handler from client - this will work!
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Critical for cookie storage
        body: JSON.stringify(parsed.output),
      });

      console.log(`📥 Client: Response status ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Client: Login successful, cookie should be stored");
        
        setState({ loading: false, error: null, success: true });
        
        // Small delay to show success message
        setTimeout(() => {
          router.push("/admin/panel");
        }, 1000);
        
      } else {
        const errorData = await response.json().catch(() => ({
          message: "Login failed. Please check your credentials."
        }));
        
        console.error("❌ Client: Login failed:", errorData);
        setState({ 
          loading: false, 
          error: errorData.message || "Login failed", 
          success: false 
        });
      }

    } catch (error) {
      console.error("❌ Client: Network error:", error);
      setState({
        loading: false,
        error: "Network error. Please check your connection.",
        success: false,
      });
    }
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
                  disabled={state.loading}
                  autoComplete="username"
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
                  disabled={state.loading}
                  autoComplete="current-password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </Field>

              <Field>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    disabled={state.loading}
                    className="rounded border-gray-300"
                  />
                  <span>Remember Me for 7 days</span>
                </label>
              </Field>

              {/* ✅ Error Display */}
              {state.error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm text-center">
                    {state.error}
                  </p>
                </div>
              )}

              {/* ✅ Success Display */}
              {state.success && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-green-600 text-sm text-center">
                    ✅ Login successful! Redirecting to admin panel...
                  </p>
                </div>
              )}

              <Field>
                <Button 
                  type="submit" 
                  disabled={state.loading} 
                  className="w-full"
                  size="lg"
                >
                  {state.loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Logging in...</span>
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
              alt="Login Illustration"
              fill
              className="object-cover dark:brightness-[0.2] dark:grayscale"
              priority
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline hover:no-underline">Terms of Service</a>{" "}
        and <a href="#" className="underline hover:no-underline">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
