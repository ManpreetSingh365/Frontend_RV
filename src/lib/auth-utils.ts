// src/lib/auth-utils.ts
import { cookies } from "next/headers";

/**
 * ✅ Auth JWT payload interface
 */
export interface AuthPayload {
  roles?: string[];
  permissions?: string[];
  sub?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

/**
 * 🟢 Simple logger utility
 */
function log(level: "info" | "warn" | "error", message: string, meta?: any) {
  if (meta) {
    console[level](`[AuthUtils][${level.toUpperCase()}] ${message}`, meta);
  } else {
    console[level](`[AuthUtils][${level.toUpperCase()}] ${message}`);
  }
}

/**
 * ✅ Reads the auth token from secure server cookies.
 * Returns null if no token is found.
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("access_token");
    if (!authCookie) {
      log("warn", "Auth cookie not found");
      return null;
    }
    log("info", "Auth cookie found");
    return authCookie.value;
  } catch (err) {
    log("error", "Failed to read auth cookie", err);
    return null;
  }
}

/**
 * 🟢 Checks if user is authenticated (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  const valid = token !== null;
  log("info", `User authenticated: ${valid}`);
  return valid;
}

/**
 * 🧩 Decodes JWT payload without verifying signature
 * Returns null if invalid or expired
 */
export function decodeAuthPayload(token: string): AuthPayload | null {
  try {
    if (!token) return null;

    const base64Url = token.split(".")[1];
    if (!base64Url) {
      log("error", "Invalid JWT format (missing payload part)");
      return null;
    }

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const payload: AuthPayload = JSON.parse(jsonPayload);

    // Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      log("warn", "JWT expired", { exp: payload.exp });
      return null;
    }

    log("info", "JWT decoded successfully", {
      user: payload.sub,
      roles: payload.roles,
      permissions: payload.permissions,
    });

    return payload;
  } catch (err) {
    log("error", "Failed to decode JWT payload", err);
    return null;
  }
}

/**
 * ✅ Client-side fallback to detect access_token existence
 * Cannot read httpOnly cookie value, only existence
 */
export function checkClientAuth(): boolean {
  if (typeof document === "undefined") return false;

  const exists = document.cookie.includes("access_token=");
  console.info("[AuthUtils] 🧭 Client auth cookie detected:", exists);
  return exists;
}

/**
 * ✅ Extracts roles from token payload (server or decoded token)
 */
export function getUserRoles(token: string | null): string[] {
  if (!token) return [];
  const payload = decodeAuthPayload(token);
  return payload?.roles || [];
}

/**
 * ✅ Extracts permissions from token payload
 */
export function getUserPermissions(token: string | null): string[] {
  if (!token) return [];
  const payload = decodeAuthPayload(token);
  return payload?.permissions || [];
}

/**
 * ✅ Returns full decoded payload safely or null
 */
export function getAuthPayload(token: string | null): AuthPayload | null {
  if (!token) return null;
  return decodeAuthPayload(token);
}
