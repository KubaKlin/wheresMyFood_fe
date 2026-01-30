import { createContext } from 'react';
import type { AuthPrincipal } from '../types';

export type AuthContextValue = {
  isAuthenticated: boolean;
  principal: AuthPrincipal | null;
  isLoading: boolean;
  handleLoginSuccess: () => Promise<void>;
  handleLogout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
