import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { getUserFacingErrorMessage } from '../../api/errors';
import {
  getRestaurantInvite,
  refreshRestaurantInvite,
} from '../../api/restaurants';
import type { RestaurantInviteInfo } from '../../types';

type InviteLinkCardProps = {
  restaurantId: number;
};

export const InviteLinkCard = ({ restaurantId }: InviteLinkCardProps) => {
  const [inviteInfo, setInviteInfo] = useState<RestaurantInviteInfo | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const inviteUrl = inviteInfo?.inviteUrl ?? '';

  const canCopy = useMemo(() => Boolean(inviteUrl), [inviteUrl]);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      setError(null);
      setIsLoading(true);
      try {
        const data = await getRestaurantInvite(restaurantId);
        if (!isActive) return;
        setInviteInfo(data);
      } catch (error) {
        if (!isActive) return;
        setError(
          getUserFacingErrorMessage(error, 'Failed to load invite link'),
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [restaurantId]);

  const handleRefreshInvite = useCallback(async () => {
    setCopySuccess(null);
    setError(null);
    setIsRotating(true);
    try {
      const data = await refreshRestaurantInvite(restaurantId);
      setInviteInfo(data);
    } catch (error) {
      setError(
        getUserFacingErrorMessage(error, 'Failed to refresh invite link'),
      );
    } finally {
      setIsRotating(false);
    }
  }, [restaurantId]);

  const handleCopyInvite = useCallback(async () => {
    setCopySuccess(null);
    setError(null);
    if (!inviteUrl) return;

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopySuccess('Copied to clipboard');
    } catch (error) {
      setError(getUserFacingErrorMessage(error, 'Failed to copy invite link'));
    }
  }, [inviteUrl]);

  if (isLoading) {
    return (
      <Card aria-label="Invite link card loading" sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CircularProgress size={18} aria-label="Loading invite link" />
            <Typography variant="body2" color="text.secondary">
              Loading invite link…
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card aria-label="Invite link card" sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="h6">Invite users</Typography>
          <Typography variant="body2" color="text.secondary">
            Share this link so users can sign up to your restaurant.
          </Typography>

          {error && (
            <Alert severity="error" role="alert" aria-label="Invite link error">
              {error}
            </Alert>
          )}

          {copySuccess && (
            <Alert
              severity="success"
              role="status"
              aria-label="Invite link copied"
            >
              {copySuccess}
            </Alert>
          )}

          <TextField
            label="Invite link"
            value={inviteUrl || 'No invite link available'}
            fullWidth
            disabled={!inviteUrl}
            aria-label="Invite link"
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant="outlined"
              onClick={handleCopyInvite}
              disabled={!canCopy}
              aria-label="Copy invite link"
            >
              Copy
            </Button>
            <Button
              variant="contained"
              onClick={handleRefreshInvite}
              disabled={isRotating}
              aria-label="Refresh invite link"
            >
              {isRotating ? 'Refreshing...' : 'Refresh link'}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
