import { Link } from 'react-router-dom';
import {
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';
import type { Order } from '../../types';
import { getOrderStatusLabel } from './orderStatus';

type OrdersListProps = {
  orders: Order[];
  emptyLabel: string;
  isActionsDisabled?: boolean;
  renderActions?: (order: Order) => ReactNode;
};

const getOrderItemsCount = (order: Order): number =>
  order.items?.reduce((acc, item) => acc + (item.quantity ?? 0), 0) ?? 0;

const OrdersList = ({
  orders,
  emptyLabel,
  isActionsDisabled,
  renderActions,
}: OrdersListProps) => {
  return (
    <Paper>
      <List aria-label="orders list">
        {orders.length > 0 ? (
          orders.map((order) => (
            <ListItem
              key={order.id}
              divider
              secondaryAction={
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    component={Link}
                    to={`/orders/${order.id}`}
                    aria-label={`Open order ${order.name}`}
                    disabled={isActionsDisabled}
                  >
                    Details
                  </Button>
                  {renderActions ? renderActions(order) : null}
                </Stack>
              }
            >
              <ListItemText
                primary={
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Typography component="span" variant="subtitle1">
                      {order.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={getOrderStatusLabel(order.status)}
                      color={
                        order.status === 'READY_TO_TAKE' ? 'success' : 'warning'
                      }
                      aria-label={`Status ${getOrderStatusLabel(order.status)}`}
                    />
                  </Stack>
                }
                secondary={
                  <>
                    {order.additionalInfo
                      ? `Info: ${order.additionalInfo}`
                      : 'No additional info'}
                    {` • Items: ${getOrderItemsCount(order)}`}
                  </>
                }
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary={emptyLabel} />
          </ListItem>
        )}
      </List>
    </Paper>
  );
};

export default OrdersList;
