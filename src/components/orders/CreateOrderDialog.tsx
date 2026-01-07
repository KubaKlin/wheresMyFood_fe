import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import type { ChangeEvent, FormEvent } from 'react';

type CreateOrderFormState = {
  name: string;
  additionalInfo: string;
};

type CreateOrderDialogProps = {
  open: boolean;
  isSaving: boolean;
  formState: CreateOrderFormState;
  onClose: () => void;
  onNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAdditionalInfoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const CreateOrderDialog = ({
  open,
  isSaving,
  formState,
  onClose,
  onNameChange,
  onAdditionalInfoChange,
  onSubmit,
}: CreateOrderDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="create-order-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="create-order-title">Create order</DialogTitle>
      <Box component="form" onSubmit={onSubmit} aria-label="create order form">
        <DialogContent>
          <Stack spacing={2} pt={1}>
            <TextField
              label="Order name"
              value={formState.name}
              onChange={onNameChange}
              required
              fullWidth
              disabled={isSaving}
              autoFocus
            />
            <TextField
              label="Additional info"
              value={formState.additionalInfo}
              onChange={onAdditionalInfoChange}
              fullWidth
              disabled={isSaving}
              multiline
              minRows={2}
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
