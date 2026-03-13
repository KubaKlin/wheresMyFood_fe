import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
} from '@mui/material';
import type { ChangeEvent, FormEvent } from 'react';
import type { Dish } from '../../types';
import CreateOrderDishesSection, {
  type CreateOrderDraftDishState,
  type CreateOrderDraftItem,
} from './CreateOrderDishesSection';

type CreateOrderFormState = {
  name: string;
  additionalInfo: string;
};

type CreateOrderDialogProps = {
  open: boolean;
  isSaving: boolean;
  isDishesLoading: boolean;
  formState: CreateOrderFormState;
  dishes: Dish[];
  draftDish: CreateOrderDraftDishState;
  draftItems: CreateOrderDraftItem[];
  errorMessage: string | null;
  onClose: () => void;
  onNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAdditionalInfoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDraftDishIdChange: (dishId: string) => void;
  onDraftDishQuantityChange: (quantity: number) => void;
  onAddDraftDish: () => void;
  onRemoveDraftDish: (dishId: number) => void;
  onDraftItemQuantityChange: (dishId: number, quantity: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const CreateOrderDialog = ({
  open,
  isSaving,
  isDishesLoading,
  formState,
  dishes,
  draftDish,
  draftItems,
  errorMessage,
  onClose,
  onNameChange,
  onAdditionalInfoChange,
  onDraftDishIdChange,
  onDraftDishQuantityChange,
  onAddDraftDish,
  onRemoveDraftDish,
  onDraftItemQuantityChange,
  onSubmit,
}: CreateOrderDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="create-order-title"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle id="create-order-title">Create order</DialogTitle>
      <Box component="form" onSubmit={onSubmit} aria-label="create order form">
        <DialogContent>
          <Stack spacing={2} pt={1}>
            {errorMessage && (
              <Alert severity="error" role="alert" aria-label="Create order error">
                {errorMessage}
              </Alert>
            )}

            <TextField
              label="Order name (eg. table 5)"
              value={formState.name}
              onChange={onNameChange}
              required
              fullWidth
              disabled={isSaving}
              autoFocus
            />
            <TextField
              label="Additional info (eg. takeout)"
              value={formState.additionalInfo}
              onChange={onAdditionalInfoChange}
              fullWidth
              disabled={isSaving}
              multiline
              minRows={2}
            />

            <Divider />

            <CreateOrderDishesSection
              dishes={dishes}
              isSaving={isSaving}
              isDishesLoading={isDishesLoading}
              draftDish={draftDish}
              draftItems={draftItems}
              onDraftDishIdChange={onDraftDishIdChange}
              onDraftDishQuantityChange={onDraftDishQuantityChange}
              onAddDraftDish={onAddDraftDish}
              onRemoveDraftDish={onRemoveDraftDish}
              onDraftItemQuantityChange={onDraftItemQuantityChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSaving} aria-label="Cancel">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSaving}
            aria-label="Create order"
          >
            {isSaving ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateOrderDialog;
