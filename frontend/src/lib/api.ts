import { ApiError } from "./types";

// Use local proxy to avoid cross-origin cookie issues
const API_BASE_URL = "/api/proxy";

export class ApiClientError extends Error {
  code: string;
  details?: { field: string; message: string }[];
  status: number;

  constructor(error: ApiError["error"], status: number) {
    super(error.message);
    this.name = "ApiClientError";
    this.code = error.code;
    this.details = error.details;
    this.status = status;
  }
}

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    let errorBody: ApiError["error"];

    try {
      const errorData = await response.json();

      // Handle standard API error format: { error: { code, message } }
      if (errorData.error && typeof errorData.error === 'object') {
        errorBody = errorData.error;
      }
      // Handle FastAPI HTTPException format: { detail: "message" }
      else if (errorData.detail) {
        errorBody = {
          code: `HTTP_${response.status}`,
          message: typeof errorData.detail === 'string'
            ? errorData.detail
            : JSON.stringify(errorData.detail),
        };
      }
      // Handle plain message format: { message: "..." }
      else if (errorData.message) {
        errorBody = {
          code: `HTTP_${response.status}`,
          message: errorData.message,
        };
      }
      // Fallback for unknown formats
      else {
        errorBody = {
          code: `HTTP_${response.status}`,
          message: JSON.stringify(errorData) || 'An error occurred',
        };
      }
    } catch {
      // JSON parsing failed
      errorBody = {
        code: `HTTP_${response.status}`,
        message: response.statusText || 'An error occurred',
      };
    }

    throw new ApiClientError(errorBody, response.status);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetchApi<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetchApi<T>(endpoint, { ...options, method: "DELETE" }),
};
