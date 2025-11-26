// src/lib/api/api-client.ts
import { env } from "../validation/env";
import { ApiResponse, ApiErrorResponse, ApiError, PaginatedResponse, PaginationMeta } from "./types";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

  // Simulate backend delay
  // await sleep(5000);

  const response = await fetch(`${env.BACKEND_PATH}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  let body: unknown = null;

  try {
    body = await response.json();
  } catch {
    body = null; // empty or non-json response
  }

  /**
   * Case 1: Backend Response Wrapper { success, data, message }
   */
  if (body && typeof body === "object" && "success" in body) {
    const apiResponse = body as ApiResponse<T>;

    if (apiResponse.success) {
      return apiResponse.data as T;
    }

    throw new ApiError(
      response.status,
      apiResponse.message ? [apiResponse.message] : ["Request failed"],
      []
    );
  }

  /**
   * Case 2: Error response
   */
  if (!response.ok) {
    const errorBody = body as ApiErrorResponse;

    throw new ApiError(
      response.status,
      errorBody?.messages || [response.statusText],
      errorBody?.errors || []
    );
  }

  /**
   * Case 3: Raw/ unwrapped response (fallback)
   */
  return body as T;
}

async function apiRequestPaginated<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<PaginatedResponse<T>> {
  const response = await fetch(`${env.BACKEND_PATH}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  let body: unknown = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (body && typeof body === "object" && "success" in body) {
    const apiResponse = body as ApiResponse<T[]>;

    if (apiResponse.success) {
      return {
        data: apiResponse.data as T[],
        meta: apiResponse.meta as PaginationMeta,
      };
    }

    throw new ApiError(
      response.status,
      apiResponse.message ? [apiResponse.message] : ["Request failed"],
      []
    );
  }

  if (!response.ok) {
    const errorBody = body as ApiErrorResponse;

    throw new ApiError(
      response.status,
      errorBody?.messages || [response.statusText],
      errorBody?.errors || []
    );
  }

  return { data: body as T[], meta: {} as PaginationMeta };
}


/* ------------ Exposed API Client ------------ */
export const apiClient = {
  get: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "GET" }),

  getPaginated: <T>(endpoint: string) =>
    apiRequestPaginated<T>(endpoint, { method: "GET" }),

  post: <Req, Res>(endpoint: string, body: Req) =>
    apiRequest<Res>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <Req, Res>(endpoint: string, body: Req) =>
    apiRequest<Res>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <Req, Res>(endpoint: string, body: Req) =>
    apiRequest<Res>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <Res>(endpoint: string) =>
    apiRequest<Res>(endpoint, { method: "DELETE" }),
};