import type { OrderStatus } from '../../types';

export const getNextOrderStatus = (status: OrderStatus): OrderStatus =>
  status === 'IN_PROGRESS' ? 'READY_TO_TAKE' : 'IN_PROGRESS';

export const getOrderStatusLabel = (status: OrderStatus): string => {
  if (status === 'IN_PROGRESS') return 'In progress';
  return 'Order completed';
};

export const getOrderStatusActionLabel = (status: OrderStatus): string => {
  if (status === 'IN_PROGRESS') return 'Mark ready';
  return 'Mark in progress';
};
