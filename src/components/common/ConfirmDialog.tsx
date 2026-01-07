import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel: string;
  isConfirmDisabled?: boolean;
  isCancelDisabled?: boolean;
  confirmButtonColor?: 'primary' | 'error';
  ariaLabel: string;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmDialog = ({
  open,
  title,
  description,
  cancelLabel = 'Cancel',
  confirmLabel,
  isConfirmDisabled,
  isCancelDisabled,
  confirmButtonColor = 'primary',
  ariaLabel,
  onClose,
  onConfirm,
}: ConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-label={ariaLabel}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          disabled={isCancelDisabled}
          aria-label="Cancel"
        >
          {cancelLabel}
        </Button>
        <Button
          variant="contained"
          color={confirmButtonColor}
          onClick={onConfirm}
          disabled={isConfirmDisabled}
          aria-label={confirmLabel}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
