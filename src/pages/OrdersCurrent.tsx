import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { createOrder, listCurrentOrders, updateOrderStatus } from '../api';
import type { CreateOrderParams, Order } from '../types';
import CenteredSpinner from '../components/common/CenteredSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import CreateOrderDialog from '../components/orders/CreateOrderDialog';
import OrdersList from '../components/orders/OrdersList';
import {
  getNextOrderStatus,
  getOrderStatusActionLabel,
} from '../components/orders/orderStatus';

type CreateOrderFormState = {
  name: string;
  additionalInfo: string;
};

const OrdersCurrent = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState<CreateOrderFormState>({
    name: '',
    additionalInfo: '',
  });

  const loadOrders = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await listCurrentOrders();
      setOrders(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load orders';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleOpenCreateDialog = () => {
    setCreateForm({ name: '', additionalInfo: '' });
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    if (isSaving) return;
    setIsCreateDialogOpen(false);
  };

  const handleCreateNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCreateForm((previous) => ({ ...previous, name: event.target.value }));
  };

  const handleCreateAdditionalInfoChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setCreateForm((previous) => ({
      ...previous,
      additionalInfo: event.target.value,
    }));
  };

  const createBody: CreateOrderParams = useMemo(
    () => ({
      name: createForm.name.trim(),
      additionalInfo: createForm.additionalInfo ?? '',
    }),
    [createForm.additionalInfo, createForm.name],
  );

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!createBody.name) {
      setError('Order name is required');
      return;
    }

    setIsSaving(true);
    try {
      await createOrder(createBody);
      setIsCreateDialogOpen(false);
      await loadOrders();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create order';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (order: Order) => {
    setError(null);
    setIsSaving(true);
    try {
      await updateOrderStatus(order.id, getNextOrderStatus(order.status));
      await loadOrders();
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

  if (isLoading) {
    return <CenteredSpinner ariaLabel="Loading current orders" />;
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={2}
      >
        <Typography variant="h4">Current Orders</Typography>
        <Button
          variant="contained"
          onClick={handleOpenCreateDialog}
          aria-label="Create order"
        >
          Create order
        </Button>
      </Box>

      {error ? <ErrorAlert message={error} /> : null}

      <OrdersList
        orders={orders}
        emptyLabel="No current orders yet"
        isActionsDisabled={isSaving}
        renderActions={(order) => (
          <Button
            variant="contained"
            onClick={() => handleToggleStatus(order)}
            aria-label={`${getOrderStatusActionLabel(order.status)} for order ${order.name}`}
            disabled={isSaving}
          >
            {getOrderStatusActionLabel(order.status)}
          </Button>
        )}
      />

      <CreateOrderDialog
        open={isCreateDialogOpen}
        isSaving={isSaving}
        formState={createForm}
        onClose={handleCloseCreateDialog}
        onNameChange={handleCreateNameChange}
        onAdditionalInfoChange={handleCreateAdditionalInfoChange}
        onSubmit={handleCreateSubmit}
      />
    </Box>
  );
};

export default OrdersCurrent;
