import { Alert } from '@mui/material';

type ErrorAlertProps = {
  message: string;
};

const ErrorAlert = ({ message }: ErrorAlertProps) => {
  return (
    <Alert severity="error" role="alert" sx={{ mb: 2 }}>
      {message}
    </Alert>
  );
};

export default ErrorAlert;
