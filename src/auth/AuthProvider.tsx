import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getCurrentPrincipal, logout } from '../api';
import type { AuthPrincipal } from '../types';
import { AuthContext } from './AuthContext';

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [principal, setPrincipal] = useState<AuthPrincipal | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentPrincipal = await getCurrentPrincipal();
        setPrincipal(currentPrincipal);
        setIsAuthenticated(true);
      } catch {
        setPrincipal(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const currentPrincipal = await getCurrentPrincipal();
      setPrincipal(currentPrincipal);
      setIsAuthenticated(true);
    } catch {
      setPrincipal(null);
      setIsAuthenticated(false);
    }
  }, []);

  const handleLoginSuccess = useCallback(async () => {
    await refreshAuth();
  }, [refreshAuth]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setPrincipal(null);
      setIsAuthenticated(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      principal,
      isLoading,
      handleLoginSuccess,
      handleLogout,
      refreshAuth,
    }),
    [
      isAuthenticated,
      principal,
      isLoading,
      handleLoginSuccess,
      handleLogout,
      refreshAuth,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
