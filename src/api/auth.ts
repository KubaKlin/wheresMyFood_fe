import type {
  AuthPrincipal,
  LoginParams,
  Restaurant,
  SignupParams,
  User,
  UserSignupParams,
} from '../types';
import { apiFetch } from './client';

export const signupRestaurant = async ({
  name,
  email,
  password,
}: SignupParams): Promise<Restaurant> =>
  apiFetch<Restaurant>('/authentication/sign-up', {
    method: 'POST',
    body: { name, email, password },
  });

export const loginRestaurant = async ({
  email,
  password,
}: LoginParams): Promise<Restaurant> =>
  apiFetch<Restaurant>('/authentication/log-in', {
    method: 'POST',
    body: { email, password },
  });

export const signupUser = async ({
  email,
  name,
  password,
  inviteCode,
}: UserSignupParams): Promise<User> =>
  apiFetch<User>('/authentication/user-sign-up', {
    method: 'POST',
    body: { email, name, password, inviteCode },
  });

export const loginUser = async ({
  email,
  password,
}: LoginParams): Promise<User> =>
  apiFetch<User>('/authentication/user-log-in', {
    method: 'POST',
    body: { email, password },
  });

export const getCurrentPrincipal = async (): Promise<AuthPrincipal> =>
  apiFetch<AuthPrincipal>('/authentication', { method: 'GET' });

export const logout = async (): Promise<void> => {
  await apiFetch<void>('/authentication/log-out', { method: 'POST' });
};
