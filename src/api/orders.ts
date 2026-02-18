import type {
  AddOrderItemParams,
  CreateOrderParams,
  GetOrderQrResponse,
  Order,
} from '../types';
import { apiFetch } from './client';

export const createOrder = async (params: CreateOrderParams): Promise<Order> =>
  apiFetch<Order>('/orders', { method: 'POST', body: params });

export const listCurrentOrders = async (): Promise<Order[]> =>
  apiFetch<Order[]>('/orders/current', { method: 'GET' });

export const listCompletedOrders = async (): Promise<Order[]> =>
  apiFetch<Order[]>('/orders/completed', { method: 'GET' });

export const updateOrderStatus = async (
  orderId: number,
  status: Order['status'],
): Promise<Order> =>
  apiFetch<Order>(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: { status },
  });

export const getOrderQr = async (
  orderId: number,
): Promise<GetOrderQrResponse> =>
  apiFetch<GetOrderQrResponse>(`/orders/${orderId}/qr`, { method: 'GET' });

export const addOrderItem = async (
  orderId: number,
  params: AddOrderItemParams,
): Promise<void> => {
  await apiFetch<void>(`/orders/${orderId}/items`, {
    method: 'POST',
    body: params,
  });
};
