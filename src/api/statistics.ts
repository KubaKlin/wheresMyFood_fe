import type {
  StatisticsOverviewResponse,
  StatisticsRange,
  TopDishStatistic,
} from '../types';
import { apiFetch } from './client';

const normalizeRange = (range: string | undefined): StatisticsRange => {
  if (range === '7d' || range === '30d') return range;
  return 'today';
};

export const getStatisticsOverview =
  async (): Promise<StatisticsOverviewResponse> =>
    apiFetch<StatisticsOverviewResponse>('/statistics/overview', {
      method: 'GET',
    });

export const getTopDishes = async (
  range?: string,
): Promise<TopDishStatistic[]> => {
  const normalizedRange = normalizeRange(range);
  return apiFetch<TopDishStatistic[]>(
    `/statistics/top-dishes?range=${encodeURIComponent(normalizedRange)}`,
    { method: 'GET' },
  );
};

export const getOrdersCompleted = async (range?: string): Promise<number> => {
  const normalizedRange = normalizeRange(range);
  return apiFetch<number>(
    `/statistics/orders-completed?range=${encodeURIComponent(normalizedRange)}`,
    { method: 'GET' },
  );
};

export const getMoneyEarned = async (
  range?: string,
): Promise<{ moneyEarned: number }> => {
  const normalizedRange = normalizeRange(range);
  return apiFetch<{ moneyEarned: number }>(
    `/statistics/money-earned?range=${encodeURIComponent(normalizedRange)}`,
    { method: 'GET' },
  );
};
