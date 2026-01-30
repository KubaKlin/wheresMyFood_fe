import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Stack,
  Alert,
} from '@mui/material';
import { signup } from '../api';
import { getUserFacingErrorMessage } from '../api/errors';

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signup({ name, email, password });
      navigate('/login');
    } catch (error) {
      setError(getUserFacingErrorMessage(error, 'Sign-up failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Restaurant Sign Up
      </Typography>

      {error && (
        <Alert severity="error" role="alert" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} aria-label="sign up form">
        <Stack spacing={2}>
          <TextField
            label="Restaurant name"
            value={name}
            onChange={handleNameChange}
            required
            fullWidth
            disabled={isLoading}
            autoComplete="organization"
          />
          <TextField
            label="Email"
            type="email"
            value={email}
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
            autoComplete="new-password"
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default SignUp;
