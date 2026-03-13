import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  addOrderItem,
  createOrder,
  listCurrentOrders,
  listDishes,
  updateOrderStatus,
} from '../api';
import { getUserFacingErrorMessage } from '../api/errors';
import type { CreateOrderParams, Dish, Order } from '../types';
import { getNextOrderStatus } from '../components/orders/orderStatus';
import { useOrdersListPage } from './useOrdersListPage';

type CreateOrderFormState = {
  name: string;
  additionalInfo: string;
};

export type CreateOrderDraftItem = {
  dishId: number;
  quantity: number;
};

export type CreateOrderDraftDishState = {
  dishId: string;
  quantity: number;
};

export const useOrdersCurrentPage = () => {
  const { orders, isLoading, error, reload } =
    useOrdersListPage(listCurrentOrders);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDishesLoading, setIsDishesLoading] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState<CreateOrderFormState>({
    name: '',
    additionalInfo: '',
  });
  const [createDishes, setCreateDishes] = useState<Dish[]>([]);
  const [createDraftDish, setCreateDraftDish] =
    useState<CreateOrderDraftDishState>({ dishId: '', quantity: 1 });
  const [createDraftItems, setCreateDraftItems] = useState<
    CreateOrderDraftItem[]
  >([]);

  const [actionError, setActionError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleOpenCreateDialog = () => {
    setCreateForm({ name: '', additionalInfo: '' });
    setCreateDraftDish({ dishId: '', quantity: 1 });
    setCreateDraftItems([]);
    setCreateError(null);
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    if (isSaving) return;
    setCreateError(null);
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

  useEffect(() => {
    if (!isCreateDialogOpen) return;
    setCreateError(null);

    const handleLoadDishes = async () => {
      setIsDishesLoading(true);
      try {
        const dishes = await listDishes();
        setCreateDishes(dishes);
      } catch (error) {
        setCreateError(getUserFacingErrorMessage(error, 'Failed to load dishes'));
      } finally {
        setIsDishesLoading(false);
      }
    };

    void handleLoadDishes();
  }, [isCreateDialogOpen]);

  const handleCreateDraftDishIdChange = useCallback((dishId: string) => {
    setCreateDraftDish((previous) => ({ ...previous, dishId }));
  }, []);

  const handleCreateDraftDishQuantityChange = useCallback((quantity: number) => {
    setCreateDraftDish((previous) => ({ ...previous, quantity }));
  }, []);

  const handleAddDraftDish = useCallback(() => {
    setCreateError(null);

    const dishId = Number(createDraftDish.dishId);
    if (!createDraftDish.dishId || !Number.isInteger(dishId) || dishId <= 0) {
      setCreateError('Please select a dish');
      return;
    }

    if (!Number.isInteger(createDraftDish.quantity) || createDraftDish.quantity < 1) {
      setCreateError('Quantity must be an integer ≥ 1');
      return;
    }

    setCreateDraftItems((previous) => {
      const existing = previous.find((item) => item.dishId === dishId);
      if (!existing) {
        return [...previous, { dishId, quantity: createDraftDish.quantity }];
      }
      return previous.map((item) =>
        item.dishId === dishId
          ? { ...item, quantity: item.quantity + createDraftDish.quantity }
          : item,
      );
    });
    setCreateDraftDish({ dishId: '', quantity: 1 });
  }, [createDraftDish.dishId, createDraftDish.quantity]);

  const handleRemoveDraftDish = useCallback((dishId: number) => {
    setCreateDraftItems((previous) => previous.filter((i) => i.dishId !== dishId));
  }, []);

  const handleDraftItemQuantityChange = useCallback(
    (dishId: number, quantity: number) => {
      setCreateDraftItems((previous) =>
        previous.map((item) => (item.dishId === dishId ? { ...item, quantity } : item)),
      );
    },
    [],
  );

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
      setCreateError(null);

      if (!createBody.name) {
        setCreateError('Order name is required');
        return;
      }

      const hasInvalidDraftItem = createDraftItems.some(
        (item) =>
          !Number.isInteger(item.dishId) ||
          item.dishId <= 0 ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1,
      );
      if (hasInvalidDraftItem) {
        setCreateError('Please fix dish quantities (must be an integer ≥ 1)');
        return;
      }

      setIsSaving(true);
      try {
        const createdOrder = await createOrder(createBody);

        if (createDraftItems.length > 0) {
          await Promise.all(
            createDraftItems.map((item) =>
              addOrderItem(createdOrder.id, {
                dishId: item.dishId,
                quantity: item.quantity,
              }),
            ),
          );
        }

        setIsCreateDialogOpen(false);
        await reload();
      } catch (error) {
        setCreateError(getUserFacingErrorMessage(error, 'Failed to create order'));
      } finally {
        setIsSaving(false);
      }
    },
    [createBody, createDraftItems, reload],
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
    createDishes,
    isDishesLoading,
    createDraftDish,
    createDraftItems,
    createError,
    reload,
    handleOpenCreateDialog,
    handleCloseCreateDialog,
    handleCreateNameChange,
    handleCreateAdditionalInfoChange,
    handleCreateDraftDishIdChange,
    handleCreateDraftDishQuantityChange,
    handleAddDraftDish,
    handleRemoveDraftDish,
    handleDraftItemQuantityChange,
    handleCreateSubmit,
    handleToggleStatus,
  };
};
