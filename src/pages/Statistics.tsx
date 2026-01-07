import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import CenteredSpinner from '../components/common/CenteredSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import { useStatisticsPage } from '../hooks/useStatisticsPage';

const getRangeLabel = (range: string) => {
  if (range === '7d') return '7 days';
  if (range === '30d') return '30 days';
  return 'Today';
};

const Statistics = () => {
  const {
    ranges,
    selectedRange,
    rangeData,
    isLoading,
    error,
    reload,
    handleRangeChange,
  } = useStatisticsPage();

  if (isLoading) {
    return <CenteredSpinner ariaLabel="Loading statistics" />;
  }

  if (error) {
    return (
      <Box>
        <ErrorAlert message={error} />
        <Button
          variant="outlined"
          onClick={reload}
          aria-label="Retry loading statistics"
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!rangeData) {
    return <ErrorAlert message="Statistics not available (missing data)" />;
  }

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={2}
        mb={2}
      >
        <Typography variant="h4">Statistics</Typography>
        <ToggleButtonGroup
          exclusive
          value={selectedRange}
          onChange={(_event, value) => handleRangeChange(String(value))}
          aria-label="Select statistics range"
          size="small"
        >
          {ranges.map((range) => (
            <ToggleButton
              key={range}
              value={range}
              aria-label={getRangeLabel(range)}
            >
              {getRangeLabel(range)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
        <Card sx={{ flex: 1 }} aria-label="Completed orders statistic">
          <CardContent>
            <Typography variant="overline" color="text.secondary">
              Completed orders
            </Typography>
            <Typography variant="h4">{rangeData.completedOrders}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }} aria-label="Money earned statistic">
          <CardContent>
            <Typography variant="overline" color="text.secondary">
              Money earned
            </Typography>
            <Typography variant="h4">{rangeData.moneyEarned} PLN</Typography>
          </CardContent>
        </Card>
      </Stack>

      <Card aria-label="Top ordered dishes">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top 3 ordered dishes
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {rangeData.topDishes.length > 0 ? (
            <Stack spacing={1}>
              {rangeData.topDishes.map((dish) => (
                <Box
                  key={dish.dishId}
                  display="flex"
                  justifyContent="space-between"
                  gap={2}
                  aria-label={`Top dish ${dish.name}`}
                >
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle1">{dish.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: {dish.price}
                    </Typography>
                  </Stack>
                  <Chip
                    label={`Quantity: ${dish.quantity}`}
                    aria-label={`Quantity ${dish.quantity}`}
                  />
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography>No dishes ordered in this range.</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Statistics;
