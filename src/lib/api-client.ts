import { env } from './env';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const url = `${env.BACKEND_PATH}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData
    );
  }

  return await response.json();
}

export const apiClient = {
  get: async <T>(endpoint: string, token?: string) =>
    apiRequest<T>(endpoint, { method: 'GET' }, token),

  post: async <Req, Res>(endpoint: string, data: Req, token?: string) =>
    apiRequest<Res>(endpoint, { method: 'POST', body: JSON.stringify(data) }, token),

  put: async <Req, Res>(endpoint: string, data: Req, token?: string) =>
    apiRequest<Res>(endpoint, { method: 'PUT', body: JSON.stringify(data) }, token),

  delete: async <Res>(endpoint: string, token?: string) =>
    apiRequest<Res>(endpoint, { method: 'DELETE' }, token),
};
