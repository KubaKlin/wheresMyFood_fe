import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { RegisterOptions } from 'react-hook-form';
import {
  addOrderItem,
  getOrderQr,
  getPublicOrderStatus,
  listDishes,
  updateOrderStatus,
} from '../api';
import { getUserFacingErrorMessage } from '../api/errors';
import type {
  Dish,
  GetOrderQrResponse,
  PublicOrderStatusResponse,
} from '../types';
import { getNextOrderStatus } from '../components/orders/orderStatus';

export type AddDishToOrderFormValues = {
  dishId: string;
  quantity: number;
};

export type AddDishToOrderValidationRules = {
  dishId: RegisterOptions<AddDishToOrderFormValues, 'dishId'>;
  quantity: RegisterOptions<AddDishToOrderFormValues, 'quantity'>;
};

export const useOrderDetailsPage = (orderId: number) => {
  const [order, setOrder] = useState<PublicOrderStatusResponse | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      setError(getUserFacingErrorMessage(error, 'Failed to load order'));
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

  const addDishValidationRules = useMemo<AddDishToOrderValidationRules>(
    () => ({
      dishId: {
        required: 'Please select a dish',
        validate: (value) => {
          const dishId = Number(value);
          if (!value) {
            return 'Please select a dish';
          }
          if (!Number.isInteger(dishId) || dishId <= 0) {
            return 'Selected dish is invalid';
          }
          return true;
        },
      },
      quantity: {
        required: 'Quantity is required',
        validate: (value) => {
          if (!Number.isFinite(value)) {
            return 'Quantity is required';
          }
          if (!Number.isInteger(value)) {
            return 'Quantity must be an integer';
          }
          if (value < 1) {
            return 'Quantity must be an integer ≥ 1';
          }
          return true;
        },
      },
    }),
    [],
  );

  const addDishForm = useForm<AddDishToOrderFormValues>({
    defaultValues: { dishId: '', quantity: 1 },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const {
    control: addDishControl,
    handleSubmit: handleAddDishFormSubmit,
    formState: { errors: addDishErrors },
    reset: resetAddDishForm,
  } = addDishForm;

  const handleAddDishValidSubmit = useCallback(
    async (values: AddDishToOrderFormValues) => {
      setError(null);

      if (!order) {
        setError('Order not loaded yet');
        return;
      }

      const dishId = Number(values.dishId);
      if (!Number.isInteger(dishId) || dishId <= 0) {
        setError('Selected dish is invalid');
        return;
      }

      if (!Number.isInteger(values.quantity) || values.quantity < 1) {
        setError('Quantity must be an integer ≥ 1');
        return;
      }

      setIsSaving(true);
      try {
        await addOrderItem(orderId, { dishId, quantity: values.quantity });
        await loadAll();
        resetAddDishForm({ dishId: '', quantity: 1 });
      } catch (error) {
        setError(
          getUserFacingErrorMessage(error, 'Failed to add dish to order'),
        );
      } finally {
        setIsSaving(false);
      }
    },
    [loadAll, order, orderId, resetAddDishForm],
  );

  const handleAddDishSubmit = useMemo(
    () => handleAddDishFormSubmit(handleAddDishValidSubmit),
    [handleAddDishFormSubmit, handleAddDishValidSubmit],
  );

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
      setError(
        getUserFacingErrorMessage(error, 'Failed to update order status'),
      );
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
      setQrError(getUserFacingErrorMessage(error, 'Failed to load QR payload'));
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
    addDishControl,
    addDishErrors,
    addDishValidationRules,
    isQrDialogOpen,
    qrData,
    qrError,
    qrPayload,
    loadAll,
    handleAddDishSubmit,
    handleToggleStatus,
    handleOpenQrDialog,
    handleCloseQrDialog,
  };
};
