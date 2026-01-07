import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { createDish, deleteDish, listDishes, updateDish } from '../api';
import type { Dish } from '../types';
import CenteredSpinner from '../components/common/CenteredSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import ConfirmDialog from '../components/common/ConfirmDialog';
import DishFormDialog from '../components/dishes/DishFormDialog';
import DishesTable from '../components/dishes/DishesTable';

type DishFormState = {
  name: string;
  price: string;
};

const Dishes = () => {
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

  if (isLoading) {
    return <CenteredSpinner ariaLabel="Loading dishes" />;
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
        <Typography variant="h4">Dishes</Typography>
        <Button
          variant="contained"
          onClick={handleOpenCreateDialog}
          aria-label="Create a new dish"
        >
          Create dish
        </Button>
      </Box>

      {error ? <ErrorAlert message={error} /> : null}

      <DishesTable
        dishes={dishes}
        onEditDish={handleOpenEditDialog}
        onDeleteDish={handleOpenDeleteDialog}
      />

      <DishFormDialog
        title="Create dish"
        open={isCreateDialogOpen}
        isSaving={isSaving}
        formState={formState}
        submitLabel="Create"
        ariaLabel="create dish form"
        onClose={handleCloseCreateDialog}
        onNameChange={handleNameChange}
        onPriceChange={handlePriceChange}
        onSubmit={handleCreateSubmit}
      />

      <DishFormDialog
        title={`Edit dish${dishToEdit ? `: ${dishToEdit.name}` : ''}`}
        open={isEditDialogOpen}
        isSaving={isSaving}
        formState={formState}
        submitLabel="Save"
        ariaLabel="edit dish form"
        onClose={handleCloseEditDialog}
        onNameChange={handleNameChange}
        onPriceChange={handlePriceChange}
        onSubmit={handleEditSubmit}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete dish"
        description={`Are you sure you want to delete ${dishToDelete?.name ?? 'this dish'}?`}
        confirmLabel={isSaving ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        confirmButtonColor="error"
        isConfirmDisabled={isSaving}
        isCancelDisabled={isSaving}
        ariaLabel="delete dish confirmation dialog"
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default Dishes;
