import { listCompletedOrders } from '../api';
import { useOrdersListPage } from './useOrdersListPage';

export const useOrdersCompletedPage = () => {
  return useOrdersListPage(listCompletedOrders);
};
