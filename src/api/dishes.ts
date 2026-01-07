import type { CreateDishParams, Dish, UpdateDishParams } from '../types';
import { apiFetch } from './client';

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
