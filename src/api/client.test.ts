import { describe, expect, it, vi } from 'vitest';
import { apiFetch } from './client';

describe('the apiFetch function', () => {
  it('it returns parsed JSON when response is ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    // @ts-expect-error - test override
    globalThis.fetch = fetchMock;

    const result = await apiFetch<{ ok: boolean }>('/x', { method: 'GET' });
    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/x',
      expect.any(Object),
    );
  });

  it('it throws message from JSON error payload (string)', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://api.local');
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'Nope' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      }),
    );
    // @ts-expect-error - test override
    globalThis.fetch = fetchMock;

    await expect(apiFetch('/x', { method: 'GET' })).rejects.toThrow('Nope');
  });
});
