import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import type { GetOrderQrResponse } from '../../types';

type QrDialogProps = {
  open: boolean;
  qrData: GetOrderQrResponse | null;
  error: string | null;
  isLoading: boolean;
  qrPayload: string;
  onClose: () => void;
};

const resolveUrl = (maybeUrl: string): string => {
  if (!maybeUrl) return '';
  try {
    return new URL(maybeUrl).toString();
  } catch {
    return new URL(maybeUrl, window.location.origin).toString();
  }
};

const getQrImageUrl = (payload: string): string => {
  const value = resolveUrl(payload);
  // Google Chart Image API dedicated QR image endpoint.
  return `https://quickchart.io/qr?text=${encodeURIComponent(value)}&size=320`;
};

const QrDialog = ({
  open,
  qrData,
  error,
  isLoading,
  qrPayload,
  onClose,
}: QrDialogProps) => {
  const statusUrl = qrData?.statusUrl ?? qrData?.qrPayload ?? '';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="order-qr-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="order-qr-title">Client QR</DialogTitle>
      <DialogContent>
        <Stack spacing={2} pt={1}>
          {error ? (
            <Alert severity="error" role="alert">
              {error}
            </Alert>
          ) : null}

          {!error && isLoading && !qrData ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="120px"
            >
              <CircularProgress aria-label="Loading QR payload" />
            </Box>
          ) : null}

          {qrPayload ? (
            <Box display="flex" justifyContent="center">
              <Box
                component="img"
                src={getQrImageUrl(qrPayload)}
                alt="Order status QR code"
                sx={{ width: 320, height: 320, maxWidth: '100%' }}
                onError={(event) => {
                  // Hide broken image icon; link below remains usable.
                  event.currentTarget.style.display = 'none';
                }}
              />
            </Box>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          component="a"
          href={resolveUrl(statusUrl)}
          target="_blank"
          rel="noreferrer"
          disabled={!statusUrl}
          aria-label="Open status page"
        >
          Open
        </Button>
        <Button onClick={onClose} aria-label="Close QR dialog">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QrDialog;
