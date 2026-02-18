import type { RestaurantInviteInfo } from '../types';
import { apiFetch } from './client';

export const getRestaurantInvite = async (
  restaurantId: number,
): Promise<RestaurantInviteInfo> =>
  apiFetch<RestaurantInviteInfo>(`/restaurants/${restaurantId}/invite`, {
    method: 'GET',
  });

export const refreshRestaurantInvite = async (
  restaurantId: number,
): Promise<RestaurantInviteInfo> =>
  apiFetch<RestaurantInviteInfo>(
    `/restaurants/${restaurantId}/invite/refresh`,
    {
      method: 'POST',
    },
  );
