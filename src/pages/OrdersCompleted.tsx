import { useCallback, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { listCompletedOrders } from '../api';
import type { Order } from '../types';
import CenteredSpinner from '../components/common/CenteredSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import OrdersList from '../components/orders/OrdersList';

const OrdersCompleted = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await listCompletedOrders();
      setOrders(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to load completed orders';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  if (isLoading) {
    return <CenteredSpinner ariaLabel="Loading completed orders" />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Completed Orders
      </Typography>

      {error ? <ErrorAlert message={error} /> : null}

      <OrdersList orders={orders} emptyLabel="No completed orders found" />
    </Box>
  );
};

export default OrdersCompleted;
