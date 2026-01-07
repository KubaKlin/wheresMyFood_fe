import type {
  AddOrderItemParams,
  CreateDishParams,
  CreateOrderParams,
  Dish,
  GetOrderQrResponse,
  LoginParams,
  Order,
  PublicOrderStatusResponse,
  Restaurant,
  SignupParams,
  UpdateDishParams,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
};

type ApiFetchOptions = {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
};

const apiFetch = async <TResponse>(
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

export const signup = async ({
  name,
  email,
  password,
}: SignupParams): Promise<Restaurant> =>
  apiFetch<Restaurant>('/authentication/sign-up', {
    method: 'POST',
    body: { name, email, password },
  });

export const login = async ({
  email,
  password,
}: LoginParams): Promise<Restaurant> =>
  apiFetch<Restaurant>('/authentication/log-in', {
    method: 'POST',
    body: { email, password },
  });

export const getCurrentRestaurant = async (): Promise<Restaurant> =>
  apiFetch<Restaurant>('/authentication', { method: 'GET' });

export const logout = async (): Promise<void> => {
  await apiFetch<void>('/authentication/log-out', { method: 'POST' });
};

// Dishes
export const listDishes = async (): Promise<Dish[]> =>
  apiFetch<Dish[]>('/dishes', { method: 'GET' });

export const createDish = async (params: CreateDishParams): Promise<Dish> =>
  apiFetch<Dish>('/dishes', { method: 'POST', body: params });

export const updateDish = async (
  dishId: number,
  params: UpdateDishParams,
): Promise<Dish> =>
  apiFetch<Dish>(`/dishes/${dishId}`, { method: 'PATCH', body: params });

export const deleteDish = async (dishId: number): Promise<void> => {
  await apiFetch<void>(`/dishes/${dishId}`, { method: 'DELETE' });
};

// Orders (auth)
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

// Orders (public client status)
export const getPublicOrderStatus = async (
  orderId: number,
): Promise<PublicOrderStatusResponse> =>
  apiFetch<PublicOrderStatusResponse>(`/orders/${orderId}/status`, {
    method: 'GET',
  });
