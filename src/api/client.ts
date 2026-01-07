const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
};

type ApiFetchOptions = {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
};

export const apiFetch = async <TResponse>(
  path: string,
  { method, body }: ApiFetchOptions,
): Promise<TResponse> => {
  if (!API_BASE_URL) {
    throw new Error('Missing VITE_API_BASE_URL');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: 'include',
    headers: DEFAULT_HEADERS,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  if (!response.ok) {
    if (isJson) {
      const errorPayload = await response.json().catch(() => null);
      const messageField =
        typeof errorPayload === 'object' &&
        errorPayload &&
        'message' in errorPayload
          ? (errorPayload as { message?: unknown }).message
          : undefined;

      if (typeof messageField === 'string' && messageField) {
        throw new Error(messageField);
      }

      if (
        Array.isArray(messageField) &&
        messageField.every((m) => typeof m === 'string')
      ) {
        throw new Error(messageField.join(', '));
      }

      throw new Error('Request failed');
    }

    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || 'Request failed');
  }

  if (!isJson) {
    return undefined as TResponse;
  }

  return response.json();
};
