import { Box, Paper, Stack, Typography } from '@mui/material';
import type { PublicOrderStatusResponse } from '../../types';

type OrderItemsCardProps = {
  items: PublicOrderStatusResponse['items'];
};

const OrderItemsCard = ({ items }: OrderItemsCardProps) => {
  return (
    <Paper sx={{ p: 2 }} aria-label="order items">
      <Typography variant="h6" gutterBottom>
        Items
      </Typography>
      {items.length > 0 ? (
        <Stack spacing={1}>
          {items.map((item) => (
            <Box
              key={item.id}
              display="flex"
              justifyContent="space-between"
              gap={2}
              aria-label="Order item"
            >
              <Typography>
                {item.dish?.name ?? `Dish #${item.dishId}`}
              </Typography>
              <Typography aria-label="Quantity">x{item.quantity}</Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography>No items yet</Typography>
      )}
    </Paper>
  );
};

export default OrderItemsCard;
