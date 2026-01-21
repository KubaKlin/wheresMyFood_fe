import { ApiError, SERVICE_UNAVAILABLE_MESSAGE } from './client';

export const getUserFacingErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (error instanceof ApiError) {
    if (error.statusCode === 503) return SERVICE_UNAVAILABLE_MESSAGE;
    if (error.message) return error.message;
    return fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  return fallbackMessage;
};
