import { Box, Typography } from '@mui/material';
import CenteredSpinner from '../components/common/CenteredSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import OrdersList from '../components/orders/OrdersList';
import { useOrdersCompletedPage } from '../hooks/useOrdersCompletedPage';

const OrdersCompleted = () => {
  const { orders, isLoading, error } = useOrdersCompletedPage();

  if (isLoading) {
    return <CenteredSpinner ariaLabel="Loading completed orders" />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Completed Orders
      </Typography>

      {error && <ErrorAlert message={error} />}

      <OrdersList orders={orders} emptyLabel="No completed orders found" />
    </Box>
  );
};

export default OrdersCompleted;
