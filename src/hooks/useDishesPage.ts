import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { createDish, deleteDish, listDishes, updateDish } from '../api';
import type { Dish } from '../types';

type DishFormState = {
  name: string;
  price: string;
};

export const useDishesPage = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [dishToEdit, setDishToEdit] = useState<Dish | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [dishToDelete, setDishToDelete] = useState<Dish | null>(null);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formState, setFormState] = useState<DishFormState>({
    name: '',
    price: '',
  });

  const loadDishes = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await listDishes();
      setDishes(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load dishes';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDishes();
  }, [loadDishes]);

  const handleOpenCreateDialog = () => {
    setFormState({ name: '', price: '' });
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    if (isSaving) return;
    setIsCreateDialogOpen(false);
  };

  const handleOpenEditDialog = (dish: Dish) => {
    setDishToEdit(dish);
    setFormState({ name: dish.name, price: String(dish.price) });
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    if (isSaving) return;
    setIsEditDialogOpen(false);
    setDishToEdit(null);
  };

  const handleOpenDeleteDialog = (dish: Dish) => {
    setDishToDelete(dish);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (isSaving) return;
    setIsDeleteDialogOpen(false);
    setDishToDelete(null);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((previous) => ({ ...previous, name: event.target.value }));
  };

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((previous) => ({ ...previous, price: event.target.value }));
  };

  const parsedPrice = useMemo(() => Number(formState.price), [formState.price]);

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!formState.name.trim()) {
      setError('Dish name is required');
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setError('Price must be a number ≥ 0');
      return;
    }

    setIsSaving(true);
    try {
      await createDish({ name: formState.name.trim(), price: parsedPrice });
      setIsCreateDialogOpen(false);
      await loadDishes();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create dish';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!dishToEdit) {
      setError('No dish selected for edit');
      return;
    }

    if (!formState.name.trim()) {
      setError('Dish name is required');
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setError('Price must be a number ≥ 0');
      return;
    }

    setIsSaving(true);
    try {
      await updateDish(dishToEdit.id, {
        name: formState.name.trim(),
        price: parsedPrice,
      });
      setIsEditDialogOpen(false);
      setDishToEdit(null);
      await loadDishes();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update dish';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    setError(null);

    if (!dishToDelete) {
      setError('No dish selected for delete');
      return;
    }

    setIsSaving(true);
    try {
      await deleteDish(dishToDelete.id);
      setIsDeleteDialogOpen(false);
      setDishToDelete(null);
      await loadDishes();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete dish';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    dishes,
    isLoading,
    error,
    isSaving,
    // dialogs + selection
    isCreateDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    dishToEdit,
    dishToDelete,
    formState,
    // actions
    loadDishes,
    handleOpenCreateDialog,
    handleCloseCreateDialog,
    handleOpenEditDialog,
    handleCloseEditDialog,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleNameChange,
    handlePriceChange,
    handleCreateSubmit,
    handleEditSubmit,
    handleConfirmDelete,
  };
};
