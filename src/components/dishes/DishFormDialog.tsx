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
import { useId } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

type DishFormState = {
  name: string;
  price: string;
};

type DishFormDialogProps = {
  title: string;
  open: boolean;
  isSaving: boolean;
  formState: DishFormState;
  submitLabel: string;
  ariaLabel: string;
  onClose: () => void;
  onNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPriceChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const DishFormDialog = ({
  title,
  open,
  isSaving,
  formState,
  submitLabel,
  ariaLabel,
  onClose,
  onNameChange,
  onPriceChange,
  onSubmit,
}: DishFormDialogProps) => {
  const titleId = useId();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id={titleId}>{title}</DialogTitle>
      <Box component="form" onSubmit={onSubmit} aria-label={ariaLabel}>
        <DialogContent>
          <Stack spacing={2} pt={1}>
            <TextField
              label="Name"
              value={formState.name}
              onChange={onNameChange}
              required
              fullWidth
              disabled={isSaving}
              autoFocus
            />
            <TextField
              label="Price"
              type="number"
              value={formState.price}
              onChange={onPriceChange}
              required
              fullWidth
              disabled={isSaving}
              inputProps={{ min: 0 }}
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
            aria-label="Save dish"
          >
            {isSaving ? 'Saving...' : submitLabel}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default DishFormDialog;
