import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Statistics from './Statistics';
import { renderWithProviders } from '../test/test-utils';

const api = vi.hoisted(() => ({
  getStatisticsOverview: vi.fn(),
}));

vi.mock('../api', () => api);

describe('the Statistics (integration)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('it loads overview and switches range', async () => {
    api.getStatisticsOverview.mockResolvedValue({
      today: {
        topDishes: [{ dishId: 1, name: 'Burger', price: 25, quantity: 2 }],
        completedOrders: 1,
        moneyEarned: 50,
      },
      '7d': {
        topDishes: [{ dishId: 2, name: 'Pizza', price: 30, quantity: 5 }],
        completedOrders: 10,
        moneyEarned: 150,
      },
      '30d': {
        topDishes: [],
        completedOrders: 40,
        moneyEarned: 999,
      },
    });

    renderWithProviders(<Statistics />);

    expect(await screen.findByText('Statistics')).toBeInTheDocument();
    expect(api.getStatisticsOverview).toHaveBeenCalledTimes(1);

    // Today
    expect(screen.getByText('Burger')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // completedOrders
    expect(screen.getByText(/50/i)).toBeInTheDocument();

    const user = userEvent.setup();

    // Switch to 7d
    await user.click(screen.getByRole('button', { name: /7 days/i }));
    expect(await screen.findByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText(/150/i)).toBeInTheDocument();

    // Switch to 30d (no top dishes)
    await user.click(screen.getByRole('button', { name: /30 days/i }));
    expect(await screen.findByText(/no dishes ordered/i)).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText(/999/i)).toBeInTheDocument();
  });
});


