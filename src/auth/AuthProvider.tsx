import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getCurrentRestaurant, logout as logoutApi } from '../api';
import type { Restaurant } from '../types';
import { AuthContext } from './AuthContext';

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentRestaurant = await getCurrentRestaurant();
        setRestaurant(currentRestaurant);
        setIsAuthenticated(true);
      } catch {
        setRestaurant(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLoginSuccess = useCallback((restaurantData: Restaurant) => {
    setRestaurant(restaurantData);
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setRestaurant(null);
      setIsAuthenticated(false);
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const currentRestaurant = await getCurrentRestaurant();
      setRestaurant(currentRestaurant);
      setIsAuthenticated(true);
    } catch {
      setRestaurant(null);
      setIsAuthenticated(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      restaurant,
      isLoading,
      handleLoginSuccess,
      handleLogout,
      refreshAuth,
    }),
    [
      isAuthenticated,
      restaurant,
      isLoading,
      handleLoginSuccess,
      handleLogout,
      refreshAuth,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
