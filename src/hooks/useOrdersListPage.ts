import { useCallback, useEffect, useState } from 'react';
import type { Order } from '../types';

type LoadOrdersFn = () => Promise<Order[]>;

export const useOrdersListPage = (loadOrdersFn: LoadOrdersFn) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await loadOrdersFn();
      setOrders(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load orders';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [loadOrdersFn]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return { orders, isLoading, error, reload: loadOrders };
};
