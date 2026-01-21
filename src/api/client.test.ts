import { afterEach, describe, expect, it, vi } from 'vitest';

const { requestMock, createMock, isAxiosErrorMock } = vi.hoisted(() => {
  const requestMock = vi.fn();
  const createMock = vi.fn(() => ({ request: requestMock }));
  const isAxiosErrorMock = vi.fn();
  return { requestMock, createMock, isAxiosErrorMock };
});

vi.mock('axios', () => ({
  default: {
    create: createMock,
    isAxiosError: isAxiosErrorMock,
  },
}));

import { ApiError, SERVICE_UNAVAILABLE_MESSAGE, apiFetch } from './client';

describe('the apiFetch function', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns parsed JSON when response is ok', async () => {
    requestMock.mockResolvedValueOnce({ data: { ok: true } });
    const result = await apiFetch<{ ok: boolean }>('/x', { method: 'GET' });
    expect(result.ok).toBe(true);
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'http://localhost:3000',
        withCredentials: true,
      }),
    );
    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/x', method: 'GET' }),
    );
  });

  it('throws message from JSON error payload (string)', async () => {
    const axiosError = {
      response: { status: 401, data: { message: 'Nope' } },
    };
    isAxiosErrorMock.mockReturnValueOnce(true);
    requestMock.mockRejectedValueOnce(axiosError);

    const promise = apiFetch('/x', { method: 'GET' });
    await expect(promise).rejects.toBeInstanceOf(ApiError);
    await expect(promise).rejects.toThrow('Nope');
  });

  it('throws a friendly message for service unavailable (503)', async () => {
    const axiosError = {
      response: { status: 503, data: { message: 'Down' } },
    };
    isAxiosErrorMock.mockReturnValueOnce(true);
    requestMock.mockRejectedValueOnce(axiosError);

    await expect(apiFetch('/x', { method: 'GET' })).rejects.toThrow(
      SERVICE_UNAVAILABLE_MESSAGE,
    );
  });
});
