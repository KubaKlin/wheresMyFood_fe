import { useCallback, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { createOrder, listCurrentOrders, updateOrderStatus } from '../api';
import { getUserFacingErrorMessage } from '../api/errors';
import type { CreateOrderParams, Order } from '../types';
import { getNextOrderStatus } from '../components/orders/orderStatus';
import { useOrdersListPage } from './useOrdersListPage';

type CreateOrderFormState = {
  name: string;
  additionalInfo: string;
};

export const useOrdersCurrentPage = () => {
  const { orders, isLoading, error, reload } =
    useOrdersListPage(listCurrentOrders);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState<CreateOrderFormState>({
    name: '',
    additionalInfo: '',
  });
  const [actionError, setActionError] = useState<string | null>(null);

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

  const handleCreateSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setActionError(null);

      if (!createBody.name) {
        setActionError('Order name is required');
        return;
      }

      setIsSaving(true);
      try {
        await createOrder(createBody);
        setIsCreateDialogOpen(false);
        await reload();
      } catch (error) {
        setActionError(
          getUserFacingErrorMessage(error, 'Failed to create order'),
        );
      } finally {
        setIsSaving(false);
      }
    },
    [createBody, reload],
  );

  const handleToggleStatus = useCallback(
    async (order: Order) => {
      setActionError(null);
      setIsSaving(true);
      try {
        await updateOrderStatus(order.id, getNextOrderStatus(order.status));
        await reload();
      } catch (error) {
        setActionError(
          getUserFacingErrorMessage(error, 'Failed to update order status'),
        );
      } finally {
        setIsSaving(false);
      }
    },
    [reload],
  );

  const combinedError = actionError ?? error;

  return {
    orders,
    isLoading,
    error: combinedError,
    isSaving,
    isCreateDialogOpen,
    createForm,
    reload,
    handleOpenCreateDialog,
    handleCloseCreateDialog,
    handleCreateNameChange,
    handleCreateAdditionalInfoChange,
    handleCreateSubmit,
    handleToggleStatus,
  };
};
