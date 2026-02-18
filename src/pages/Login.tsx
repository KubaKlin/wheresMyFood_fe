import { useState } from 'react';
import type { ChangeEvent, FormEvent, MouseEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Stack,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { loginRestaurant, loginUser } from '../api';
import { getUserFacingErrorMessage } from '../api/errors';
import { useAuth } from '../hooks/useAuth';

type LoginAccountType = 'restaurant' | 'user';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleLoginSuccess } = useAuth();
  const initialAccountTypeParam = searchParams.get('as');
  const initialAccountType: LoginAccountType =
    initialAccountTypeParam === 'user' ? 'user' : 'restaurant';

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [accountType, setAccountType] =
    useState<LoginAccountType>(initialAccountType);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const emailPrefill = searchParams.get('email');
  const resolvedEmail = email || emailPrefill || '';

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleAccountTypeChange = (
    event: MouseEvent<HTMLElement>,
    value: LoginAccountType | null,
  ) => {
    void event;
    if (!value) return;
    setAccountType(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (accountType === 'user') {
        await loginUser({ email: resolvedEmail, password });
      } else {
        await loginRestaurant({ email: resolvedEmail, password });
      }
      await handleLoginSuccess();
      navigate('/');
    } catch (error) {
      setError(getUserFacingErrorMessage(error, 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Log In
      </Typography>

      {error && (
        <Alert severity="error" role="alert" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} aria-label="log in form">
        <Stack spacing={2}>
          <ToggleButtonGroup
            exclusive
            value={accountType}
            onChange={handleAccountTypeChange}
            aria-label="Select account type"
            size="small"
          >
            <ToggleButton value="restaurant" aria-label="Restaurant account">
              Restaurant
            </ToggleButton>
            <ToggleButton value="user" aria-label="User account">
              User
            </ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label="Email"
            type="email"
            value={resolvedEmail}
            onChange={handleEmailChange}
            required
            fullWidth
            disabled={isLoading}
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            fullWidth
            disabled={isLoading}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default Login;
