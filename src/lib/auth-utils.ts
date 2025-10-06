import { cookies } from "next/headers";

/**
 * Server-side cookie utilities
 * These functions can only be used in server components or server actions
 */

export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("auth_token");
    return authCookie?.value || null;
  } catch (error) {
    console.error("Failed to read auth cookie:", error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  return token !== null;
}

export async function clearAuthCookie(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
  } catch (error) {
    console.error("Failed to clear auth cookie:", error);
  }
}

/**
 * Client-side cookie utilities (for non-httpOnly cookies only)
 * Note: Since we're using httpOnly cookies, these won't work for auth_token
 */
export function getClientCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}
