import {
  createContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';
import { getCurrentRestaurant, logout as logoutApi } from './api';
import type { Restaurant } from './types';

interface AuthContextType {
  isAuthenticated: boolean;
  restaurant: Restaurant | null;
  isLoading: boolean;
  handleLoginSuccess: (restaurant: Restaurant) => void;
  handleLogout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  restaurant: null,
  isLoading: true,
  handleLoginSuccess: () => {},
  handleLogout: async () => {},
  refreshAuth: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state by checking with backend on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentRestaurant = await getCurrentRestaurant();
        setRestaurant(currentRestaurant);
        setIsAuthenticated(true);
      } catch {
        // User is not authenticated
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
