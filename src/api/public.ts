import type { PublicOrderStatusResponse } from '../types';
import { apiFetch } from './client';

export const getPublicOrderStatus = async (
  orderId: number,
): Promise<PublicOrderStatusResponse> =>
  apiFetch<PublicOrderStatusResponse>(`/orders/${orderId}/status`, {
    method: 'GET',
  });
