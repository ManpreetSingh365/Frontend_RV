import { cookies } from "next/headers";

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

// Client-side utility to check if user is logged in
export function checkClientAuth(): boolean {
  if (typeof document === "undefined") return false;

  // Check if auth_token cookie exists (not accessible due to httpOnly, but we can try)
  // This is mainly for client-side route checks before middleware kicks in
  return document.cookie.includes("auth_token=");
}
