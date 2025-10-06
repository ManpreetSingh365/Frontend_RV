// "use server";

// import { safeParse } from "valibot";
// import { loginSchema } from "@/lib/valibot/schemas/loginSchema";
// import { apiClient } from "@/lib/api-client";
// import { redirect } from "next/navigation";

// export interface ServerActionState {
//   success: boolean;
//   errors: Record<string, string>;
//   message?: string;
// }

// export interface LoginPayload {
//   username: string;
//   password: string;
//   rememberMe?: boolean;
// }

// export async function loginAction(
//   data: LoginPayload
// ): Promise<ServerActionState> {
//   // ✅ Validate input with Valibot
//   const parsed = safeParse(loginSchema, data);
//   if (!parsed.success) {
//     const errors =
//       parsed.issues?.reduce<Record<string, string>>((acc, issue) => {
//         const key = issue.path?.[0] as unknown as keyof LoginPayload;
//         if (key) acc[key] = issue.message;
//         return acc;
//       }, {}) || {};
//     return { success: false, errors };
//   }

//   try {
//     console.log("🔐 Server Action: Starting login process");

//     // ✅ This now goes through Route Handler which properly forwards cookies
//     const response = await apiClient.post<
//       typeof parsed.output,
//       { message?: string }
//     >("/api/v1/auth/login", parsed.output);

//     console.log("✅ Server Action: Login successful, cookie should be set");
//   } catch (err: any) {
//     console.error("❌ Server Action: Login error:", err);
//     return {
//       success: false,
//       errors: {},
//       message: err.message || "Authentication failed. Please try again.",
//     };
//   }

//   // ✅ Redirect after successful login (outside try/catch)
//   redirect("/admin/panel");
// }
