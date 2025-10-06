// src/lib/api-client.tsx
import { env } from "./env";

export class ApiError extends Error {
  constructor(message: string, public status: number, public response?: any) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // ✅ Route auth requests through Next.js Route Handler
  let url: string;

  if (endpoint.startsWith("/api/v1/auth/")) {
    // Auth endpoints go through Next.js Route Handler
    const authPath = endpoint.replace("/api/v1/auth/", "");
    url = `${env.FRONTEND_PATH}/api/auth/${authPath}`;
  } else {
    // Other endpoints go directly to backend
    url = `${env.BACKEND_PATH}${endpoint}`;
  }

  const config: RequestInit = {
    ...options,
    credentials: "include", // ✅ Critical for cookie handling
    mode: "cors",
    cache: "no-store", // Prevent caching of auth requests
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  console.log(`🔄 API Client: ${config.method || "GET"} ${url}`);

  try {
    const response = await fetch(url, config);

    console.log(`📥 Response: ${response.status} ${response.statusText}`);

    // Log cookies for debugging
    const cookieHeader = response.headers.get("set-cookie");
    if (cookieHeader) {
      console.log("🍪 Set-Cookie header present in response");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));

      throw new ApiError(
        errorData.message || `Request failed with status ${response.status}`,
        response.status,
        errorData
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error("❌ Network error:", error);
    throw new ApiError("Network error occurred", 0, error);
  }
}

export const apiClient = {
  get: async <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "GET" }),

  post: async <Req, Res>(endpoint: string, data: Req) =>
    apiRequest<Res>(endpoint, { method: "POST", body: JSON.stringify(data) }),

  put: async <Req, Res>(endpoint: string, data: Req) =>
    apiRequest<Res>(endpoint, { method: "PUT", body: JSON.stringify(data) }),

  delete: async <Res>(endpoint: string) =>
    apiRequest<Res>(endpoint, { method: "DELETE" }),
};
