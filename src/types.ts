export interface Restaurant {
  id: number;
  email: string;
  name: string;
  inviteCode?: string | null;
}

export interface SignupParams {
  name: string;
  email: string;
  password: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export type AuthPrincipal = {
  type: 'restaurant' | 'user';
  id: number;
  restaurantId: number;
  userId?: number;
};

export interface User {
  id: number;
  email: string;
  name: string;
  restaurantId?: number;
}

export interface UserSignupParams {
  email: string;
  name: string;
  password: string;
  inviteCode: string;
}

export type RestaurantInviteInfo = {
  inviteCode: string | null;
  inviteUrl: string | null;
};

export type OrderStatus = 'IN_PROGRESS' | 'READY_TO_TAKE';

export interface Dish {
  id: number;
  name: string;
  price: number;
}

export interface CreateDishParams {
  name: string;
  price: number;
}

export interface UpdateDishParams {
  name?: string;
  price?: number;
}

export interface Order {
  id: number;
  name: string;
  additionalInfo?: string;
  status: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
  items?: OrderItem[];
}

export interface CreateOrderParams {
  name: string;
  additionalInfo: string;
}

export interface AddOrderItemParams {
  dishId: number;
  quantity?: number;
}

export interface OrderItem {
  id: number;
  dishId: number;
  quantity: number;
  dish?: Dish;
}

export interface GetOrderQrResponse {
  statusUrl?: string;
  qrPayload?: string;
}

export interface PublicOrderStatusResponse {
  id: number;
  name?: string;
  status: OrderStatus;
  additionalInfo?: string;
  items: OrderItem[];
}

export type StatisticsRange = 'today' | '7d' | '30d';

export interface TopDishStatistic {
  dishId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface StatisticsRangeOverview {
  topDishes: TopDishStatistic[];
  completedOrders: number;
  moneyEarned: number;
}

export type StatisticsOverviewResponse = {
  today: StatisticsRangeOverview;
  '7d': StatisticsRangeOverview;
  '30d': StatisticsRangeOverview;
};
