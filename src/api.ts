export { apiFetch } from './api/client';

export { signup, login, getCurrentRestaurant, logout } from './api/auth';

export { listDishes, createDish, updateDish, deleteDish } from './api/dishes';

export {
  createOrder,
  listCurrentOrders,
  listCompletedOrders,
  updateOrderStatus,
  getOrderQr,
  addOrderItem,
} from './api/orders';

export { getPublicOrderStatus } from './api/public';

export {
  getStatisticsOverview,
  getTopDishes,
  getOrdersCompleted,
  getMoneyEarned,
} from './api/statistics';
