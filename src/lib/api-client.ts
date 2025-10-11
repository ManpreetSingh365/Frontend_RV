// src/lib/api-client.ts
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
  let url = endpoint.startsWith("/api/v1/auth/")
    ? `${env.FRONTEND_PATH}/api/auth/${endpoint.replace("/api/v1/auth/", "")}`
    : `${env.BACKEND_PATH}${endpoint}`;

  const config: RequestInit = {
    ...options,
    credentials: "include",
    mode: "cors",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };
  console.log(`🔄 API Client: ${config.method || "GET"} ${url}`);

  const res = await fetch(url, config);
  console.log(`📥 Response: ${res.status} ${res.statusText}`);

  const cookieHeader = res.headers.get("set-cookie");
  if (cookieHeader) {
    console.log("🍪 Set-Cookie header present in response");
  }

  const data = await res.json().catch(() => ({
    message: `HTTP ${res.status}: ${res.statusText}`,
  }));

  if (!res.ok)
    throw new ApiError(data.message || "Request failed", res.status, data);

  return data;
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
