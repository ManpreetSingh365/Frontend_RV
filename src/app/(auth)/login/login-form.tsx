'use client';

import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';

import { loginSchema } from '@/lib/valibot/schemas/loginSchema';
import { loginAction, LoginPayload, ServerActionState } from '@/app/(auth)/login/_actions/loginAction';
import { safeParse } from 'valibot';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe?: boolean;
}

const initialState: ServerActionState = {
  success: false,
  errors: {},
  message: '',
};

export function LoginForm({ className }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [formState, setFormState] = useState<ServerActionState>(initialState);
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFormValues>();

  // Redirect to dashboard on success
  useEffect(() => {
    if (formState.success) router.push('/admin/panel');
  }, [formState.success, router]);

  const onSubmit = (values: LoginFormValues) => {
    // 1️⃣ Client-side Valibot validation
    const parsed = safeParse(loginSchema, values);

    if (!parsed.success) {
      parsed.issues?.forEach(issue => {
        if (issue.path && issue.path.length > 0) {
          const key = issue.path[0] as unknown as keyof LoginFormValues;
          setError(key, { message: issue.message });
        } else {
          setError('username', { message: issue.message });
        }
      });
      return;
    }

    const output: LoginPayload = parsed.output;

    // 2️⃣ Call server action
    startTransition(async () => {
      const result = await loginAction(output);

      // Map server errors to form fields
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, message]) => {
          setError(field as keyof LoginFormValues, { message });
        });
      }

      // 3️⃣ Save auth_token - JWT
      if (result.success && result.token) {
        if (values.rememberMe) {
          Cookies.set('auth_token', result.token, { expires: 7, secure: true, sameSite: 'strict' });
        } else {
          sessionStorage.setItem('auth_token', result.token);
        }
      }

      setFormState(result);
    });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center mb-6">
                <h1 className="text-2xl font-bold">Welcome back 👋</h1>
                <p className="text-muted-foreground text-balance">
                  Let’s Hit the Road with RouteVision 🚚
                </p>
              </div>

              {/* Username */}
              <Field>
                <FieldLabel htmlFor="username">Username 👤</FieldLabel>
                <Input
                  id="username"
                  {...register('username', { required: 'Username is required' })}
                  placeholder="Enter your username"
                  disabled={isPending}
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password">Password 🔒</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  placeholder="Enter your password"
                  disabled={isPending}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </Field>

              {/* Remember Me */}
              <Field>
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register('rememberMe')} disabled={isPending} />
                  Remember Me
                </label>
              </Field>

              {/* Server message */}
              {formState.message && !formState.success && (
                <p className="text-red-600 text-center mb-4">{formState.message}</p>
              )}

              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Logging in…' : 'Login 🚀'}
                </Button>
              </Field>
            </FieldGroup>
          </form>

          {/* Right-side image */}
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
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
