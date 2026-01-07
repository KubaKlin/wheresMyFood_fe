import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { SelectChangeEvent } from '@mui/material';
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
import { getNextOrderStatus } from '../components/orders/orderStatus';

export const useOrderDetailsPage = (orderId: number) => {
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

  const handleAddDish = useCallback(async () => {
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
  }, [loadAll, order, orderId, parsedQuantity, selectedDishId]);

  const handleToggleStatus = useCallback(async () => {
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
  }, [loadAll, order, orderId]);

  const handleOpenQrDialog = useCallback(async () => {
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
  }, [orderId]);

  const handleCloseQrDialog = () => {
    setIsQrDialogOpen(false);
    setQrError(null);
    setQrData(null);
  };

  const qrPayload = useMemo(
    () => qrData?.qrPayload ?? qrData?.statusUrl ?? '',
    [qrData],
  );

  return {
    order,
    dishes,
    isLoading,
    error,
    isSaving,
    selectedDishId,
    quantity,
    isQrDialogOpen,
    qrData,
    qrError,
    qrPayload,
    loadAll,
    handleSelectedDishChange,
    handleQuantityChange,
    handleAddDish,
    handleToggleStatus,
    handleOpenQrDialog,
    handleCloseQrDialog,
  };
};
