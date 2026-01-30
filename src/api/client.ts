import axios from 'axios';

const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
};

type ApiFetchOptions = {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
};

export const SERVICE_UNAVAILABLE_MESSAGE =
  "We're sorry, currently the application is down. We are working on fixing it. Please check again soon.";

type BackendErrorPayload = {
  message?: unknown;
};

export class ApiError extends Error {
  public readonly statusCode?: number;
  public readonly payload?: unknown;

  public constructor(
    message: string,
    options?: { statusCode?: number; payload?: unknown; cause?: unknown },
  ) {
    super(
      message,
      options?.cause !== undefined ? { cause: options.cause } : undefined,
    );
    this.name = 'ApiError';
    this.statusCode = options?.statusCode;
    this.payload = options?.payload;
  }
}

const getBackendMessage = (payload: unknown): string | null => {
  if (!payload || typeof payload !== 'object') return null;
  const messageField =
    'message' in payload ? (payload as BackendErrorPayload).message : undefined;

  if (typeof messageField === 'string' && messageField.trim())
    return messageField;
  if (
    Array.isArray(messageField) &&
    messageField.length > 0 &&
    messageField.every((m) => typeof m === 'string')
  ) {
    return messageField.join(', ');
  }

  return null;
};

export const apiFetch = async <TResponse>(
  path: string,
  { method, body }: ApiFetchOptions,
): Promise<TResponse> => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error('Missing VITE_API_BASE_URL');
  }

  const client = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
    headers: DEFAULT_HEADERS,
  });

  try {
    const response = await client.request<TResponse>({
      url: path,
      method,
      data: body,
    });
    return response.data;
  } catch (error: unknown) {
    if (!axios.isAxiosError(error)) {
      throw new ApiError('Request failed', { cause: error });
    }

    const statusCode = error.response?.status;
    const payload = error.response?.data;

    if (statusCode === 503) {
      throw new ApiError(SERVICE_UNAVAILABLE_MESSAGE, {
        statusCode,
        payload,
        cause: error,
      });
    }

    const backendMessage = getBackendMessage(payload);
    throw new ApiError(backendMessage ?? 'Request failed', {
      statusCode,
      payload,
      cause: error,
    });
  }
};
