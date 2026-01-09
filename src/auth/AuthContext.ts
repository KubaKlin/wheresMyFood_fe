import { createContext } from 'react';
import type { Restaurant } from '../types';

export type AuthContextValue = {
  isAuthenticated: boolean;
  restaurant: Restaurant | null;
  isLoading: boolean;
  handleLoginSuccess: (restaurant: Restaurant) => void;
  handleLogout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
