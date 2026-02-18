import { Box, Button, Typography } from '@mui/material';
import CenteredSpinner from '../components/common/CenteredSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import ConfirmDialog from '../components/common/ConfirmDialog';
import DishFormDialog from '../components/dishes/DishFormDialog';
import DishesTable from '../components/dishes/DishesTable';
import { useDishesPage } from '../hooks/useDishesPage';

const Dishes = () => {
  const {
    dishes,
    isLoading,
    error,
    isSaving,
    isCreateDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    dishToEdit,
    dishToDelete,
    formState,
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
  } = useDishesPage();

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

      {error && <ErrorAlert message={error} />}

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
