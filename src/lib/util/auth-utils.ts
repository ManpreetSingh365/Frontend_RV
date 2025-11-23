// src/lib/auth-utils.ts
import { logger } from "@/lib/service/logger";
import { cookies } from "next/headers";

/**
 * Auth JWT payload interface matching backend structure
 */
export interface AuthPayload {
  role: string;
  permissions: string[];
  userId: string;
  sub: string;
  jti: string;
  iat: number;
  exp: number;
}

/**
 * Read httpOnly access token from server cookies
*/
export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("access_token")?.value ?? null;
  } catch (err) {
    logger.error("Failed to read auth cookie", {
      source: "AuthUtils",
      data: err,
    });
    return null;
  }
}

/**
 * Server-side authentication check
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Decode JWT payload without signature verification
 * Returns null for invalid or expired tokens
 */
export function decodeAuthPayload(token: string): AuthPayload | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    const decoded = JSON.parse(
      Buffer.from(payloadPart, "base64").toString("utf-8")
    ) as AuthPayload;

    // Expiration check
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return null;
    }

    return decoded;
  } catch (err) {
    logger.warn("Failed to decode JWT", {
      source: "AuthUtils",
      data: err,
    });
    return null;
  }
}

/**
 * Extracts user role from token
 */
export function getUserRole(token: string | null): string | null {
  if (!token) return null;
  return decodeAuthPayload(token)?.role ?? null;
}

/**
 * Extracts permissions from token
 */
export function getUserPermissions(token: string | null): string[] {
  if (!token) return [];
  return decodeAuthPayload(token)?.permissions ?? [];
}

/**
 * Extracts userId from token
 */
export function getUserId(token: string | null): string | null {
  if (!token) return null;
  return decodeAuthPayload(token)?.userId ?? null;
}