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
  const url = `${env.BACKEND_PATH}${endpoint}`;

  const config: RequestInit = {
    ...options,
    credentials: "include", // ✅ Critical for cross-origin cookies
    mode: "cors", // ✅ Explicit CORS mode
    cache: "no-store", // ✅ Prevent caching authentication requests
    headers: {
      "Content-Type": "application/json",
      // Don't manually add cookies - browser handles this with credentials: include
      ...(options.headers || {}),
    },
  };

  console.log(`🔄 Making ${config.method || "GET"} request to: ${url}`); // Debug log

  const response = await fetch(url, config);

  // Log response headers for debugging
  console.log(`📥 Response status: ${response.status}`);
  console.log(
    `📥 Response headers:`,
    Object.fromEntries(response.headers.entries())
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData
    );
  }

  return response.json();
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
