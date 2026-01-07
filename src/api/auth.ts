import type { LoginParams, Restaurant, SignupParams } from '../types';
import { apiFetch } from './client';

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
