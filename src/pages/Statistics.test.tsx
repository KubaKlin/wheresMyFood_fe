import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import Statistics from './Statistics';
import { renderWithProviders } from '../test/test-utils';

vi.mock('../hooks/useStatisticsPage', () => ({
  useStatisticsPage: () => ({
    ranges: ['today', '7d', '30d'],
    selectedRange: 'today',
    rangeData: {
      topDishes: [{ dishId: 1, name: 'Pizza', price: 30, quantity: 5 }],
      completedOrders: 12,
      moneyEarned: 123,
    },
    overview: null,
    isLoading: false,
    error: null,
    reload: vi.fn(),
    handleRangeChange: vi.fn(),
  }),
}));

describe('the Statistics page', () => {
  it('it renders stats cards and top dishes', () => {
    renderWithProviders(<Statistics />);

    expect(screen.getByText('Statistics')).toBeInTheDocument();
    expect(screen.getByText('Completed orders')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();

    expect(screen.getByText(/Money earned/i)).toBeInTheDocument();
    expect(screen.getByText(/123/i)).toBeInTheDocument();

    expect(screen.getByText(/Top 3 ordered dishes/i)).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText(/Qty: 5/i)).toBeInTheDocument();
  });
});
