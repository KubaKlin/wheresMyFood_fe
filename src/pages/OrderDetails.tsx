import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  type SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import {
  addOrderItem,
  getOrderQr,
  getPublicOrderStatus,
  listDishes,
  updateOrderStatus,
} from '../api';
import type {
  Dish,
  GetOrderQrResponse,
  PublicOrderStatusResponse,
} from '../types';
import CenteredSpinner from '../components/common/CenteredSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import AddDishToOrderCard from '../components/orders/AddDishToOrderCard';
import OrderItemsCard from '../components/orders/OrderItemsCard';
import QrDialog from '../components/orders/QrDialog';
import {
  getNextOrderStatus,
  getOrderStatusActionLabel,
  getOrderStatusLabel,
} from '../components/orders/orderStatus';

const OrderDetails = () => {
  const params = useParams();
  const orderId = Number(params.orderId);

  const [order, setOrder] = useState<PublicOrderStatusResponse | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDishId, setSelectedDishId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [isQrDialogOpen, setIsQrDialogOpen] = useState<boolean>(false);
  const [qrData, setQrData] = useState<GetOrderQrResponse | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const [orderStatus, dishList] = await Promise.all([
        getPublicOrderStatus(orderId),
        listDishes(),
      ]);
      setOrder(orderStatus);
      setDishes(dishList);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load order';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!Number.isFinite(orderId) || orderId <= 0) {
      setError('Invalid order id');
      setIsLoading(false);
      return;
    }
    loadAll();
  }, [loadAll, orderId]);

  const handleSelectedDishChange = (event: SelectChangeEvent<string>) => {
    setSelectedDishId(event.target.value);
  };

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  const parsedQuantity = useMemo(() => Number(quantity), [quantity]);

  const handleAddDish = async () => {
    setError(null);

    if (!order) {
      setError('Order not loaded yet');
      return;
    }

    if (!selectedDishId) {
      setError('Please select a dish');
      return;
    }

    const dishId = Number(selectedDishId);
    if (!Number.isInteger(dishId) || dishId <= 0) {
      setError('Selected dish is invalid');
      return;
    }

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      setError('Quantity must be an integer ≥ 1');
      return;
    }

    setIsSaving(true);
    try {
      await addOrderItem(orderId, { dishId, quantity: parsedQuantity });
      await loadAll();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to add dish to order';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    setError(null);

    if (!order) {
      setError('Order not loaded yet');
      return;
    }

    setIsSaving(true);
    try {
      const nextStatus = getNextOrderStatus(order.status);
      await updateOrderStatus(orderId, nextStatus);
      await loadAll();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update order status';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenQrDialog = async () => {
    setQrError(null);
    setIsQrDialogOpen(true);
    setQrData(null);

    try {
      const data = await getOrderQr(orderId);
      setQrData(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load QR payload';
      setQrError(message);
    }
  };

  const handleCloseQrDialog = () => {
    setIsQrDialogOpen(false);
    setQrError(null);
    setQrData(null);
  };

  const qrPayload = useMemo(
    () => qrData?.qrPayload ?? qrData?.statusUrl ?? '',
    [qrData],
  );

  if (isLoading) {
    return <CenteredSpinner ariaLabel="Loading order details" />;
  }

  if (error) {
    return (
      <Box>
        <ErrorAlert message={error} />
        <Button
          variant="outlined"
          onClick={loadAll}
          aria-label="Retry loading order"
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!order) {
    return (
      <Alert severity="error" role="alert">
        Order not found
      </Alert>
    );
  }

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={2}
        mb={2}
      >
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="h4">
            {order.name ? order.name : `Order #${order.id}`}
          </Typography>
          <Chip
            label={getOrderStatusLabel(order.status)}
            color={order.status === 'READY_TO_TAKE' ? 'success' : 'warning'}
            aria-label={`Order status ${getOrderStatusLabel(order.status)}`}
          />
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={loadAll}
            disabled={isSaving}
            aria-label="Refresh"
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            onClick={handleToggleStatus}
            disabled={isSaving}
            aria-label={getOrderStatusActionLabel(order.status)}
          >
            {getOrderStatusActionLabel(order.status)}
          </Button>
          <Button
            variant="outlined"
            onClick={handleOpenQrDialog}
            aria-label="Show QR code"
          >
            Show QR
          </Button>
        </Stack>
      </Stack>

      {order.additionalInfo && (
        <Alert severity="info" sx={{ mb: 2 }} aria-label="Additional info">
          {order.additionalInfo}
        </Alert>
      )}

      <AddDishToOrderCard
        dishes={dishes}
        selectedDishId={selectedDishId}
        quantity={quantity}
        isSaving={isSaving}
        onSelectedDishChange={handleSelectedDishChange}
        onQuantityChange={handleQuantityChange}
        onAdd={handleAddDish}
      />

      <OrderItemsCard items={order.items} />

      <QrDialog
        open={isQrDialogOpen}
        qrData={qrData}
        error={qrError}
        isLoading={isQrDialogOpen && !qrData && !qrError}
        qrPayload={qrPayload}
        onClose={handleCloseQrDialog}
      />
    </Box>
  );
};

export default OrderDetails;
