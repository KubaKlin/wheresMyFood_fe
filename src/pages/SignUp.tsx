import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Stack,
  Alert,
} from '@mui/material';
import { signupRestaurant, signupUser } from '../api';
import { getUserFacingErrorMessage } from '../api/errors';

const SignUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteCodeParam = searchParams.get('inviteCode');
  const inviteCode = inviteCodeParam?.trim() ?? '';
  const isInviteSignUp = Boolean(inviteCode);

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
      if (isInviteSignUp) {
        await signupUser({ name, email, password, inviteCode });
        navigate(`/login?as=user&email=${encodeURIComponent(email)}`);
        return;
      }

      await signupRestaurant({ name, email, password });
      navigate('/login?as=restaurant');
    } catch (error) {
      setError(getUserFacingErrorMessage(error, 'Sign-up failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {isInviteSignUp ? 'User Sign Up' : 'Restaurant Sign Up'}
      </Typography>

      {error && (
        <Alert severity="error" role="alert" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} aria-label="sign up form">
        <Stack spacing={2}>
          <TextField
            label={isInviteSignUp ? 'Your name' : 'Restaurant name'}
            value={name}
            onChange={handleNameChange}
            required
            fullWidth
            disabled={isLoading}
            autoComplete={isInviteSignUp ? 'name' : 'organization'}
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
          {isInviteSignUp && (
            <TextField
              label="Invite code"
              value={inviteCode}
              disabled
              fullWidth
            />
          )}
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
            disabled={isLoading || (isInviteSignUp && !inviteCode)}
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
