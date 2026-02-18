import { Box, CircularProgress } from '@mui/material';

type CenteredSpinnerProps = {
  ariaLabel: string;
  minHeight?: number | string;
};

const CenteredSpinner = ({
  ariaLabel,
  minHeight = 200,
}: CenteredSpinnerProps) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={minHeight}
    >
      <CircularProgress aria-label={ariaLabel} />
    </Box>
  );
};

export default CenteredSpinner;
