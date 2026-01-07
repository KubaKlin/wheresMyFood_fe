import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  screen,
  within,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrdersCurrent from './OrdersCurrent';
import { renderWithProviders } from '../test/test-utils';

const api = vi.hoisted(() => ({
  listCurrentOrders: vi.fn(),
  createOrder: vi.fn(),
  updateOrderStatus: vi.fn(),
}));

vi.mock('../api', () => api);

describe('the OrdersCurrent (integration)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads current orders, can create, and can toggle status', async () => {
    api.listCurrentOrders
      .mockResolvedValueOnce([
        {
          id: 1,
          name: 'Order A',
          status: 'IN_PROGRESS',
          additionalInfo: '',
          items: [],
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 1,
          name: 'Order A',
          status: 'IN_PROGRESS',
          additionalInfo: '',
          items: [],
        },
        {
          id: 2,
          name: 'Order B',
          status: 'IN_PROGRESS',
          additionalInfo: 'no onions',
          items: [],
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 1,
          name: 'Order A',
          status: 'READY_TO_TAKE',
          additionalInfo: '',
          items: [],
        },
        {
          id: 2,
          name: 'Order B',
          status: 'IN_PROGRESS',
          additionalInfo: 'no onions',
          items: [],
        },
      ]);

    api.createOrder.mockResolvedValue({
      id: 2,
      name: 'Order B',
      status: 'IN_PROGRESS',
      additionalInfo: 'no onions',
    });
    api.updateOrderStatus.mockResolvedValue({
      id: 1,
      name: 'Order A',
      status: 'READY_TO_TAKE',
      additionalInfo: '',
    });

    renderWithProviders(<OrdersCurrent />);

    expect(await screen.findByText('Current Orders')).toBeInTheDocument();
    expect(await screen.findByText('Order A')).toBeInTheDocument();
    expect(api.listCurrentOrders).toHaveBeenCalledTimes(1);

    const user = userEvent.setup();

    // Create order
    await user.click(screen.getByRole('button', { name: /create order/i }));
    const dialog = screen.getByRole('dialog', { name: /create order/i });
    await user.type(within(dialog).getByLabelText(/order name/i), 'Order B');
    await user.type(
      within(dialog).getByLabelText(/additional info/i),
      'no onions',
    );
    await user.click(
      within(dialog).getByRole('button', { name: /create order/i }),
    );
    await waitForElementToBeRemoved(() =>
      screen.queryByRole('dialog', { name: /create order/i }),
    );

    expect(api.createOrder).toHaveBeenCalledWith({
      name: 'Order B',
      additionalInfo: 'no onions',
    });
    expect(await screen.findByText('Order B')).toBeInTheDocument();

    // Toggle status for Order A (use the aria-label to avoid ambiguity)
    await user.click(
      screen.getByRole('button', { name: /mark ready for order order a/i }),
    );
    expect(api.updateOrderStatus).toHaveBeenCalledWith(1, 'READY_TO_TAKE');

    // after reload, status chip should show completed label (from helper)
    expect(await screen.findByText(/order completed/i)).toBeInTheDocument();

    // ensure create dialog closed
    expect(
      screen.queryByRole('dialog', { name: /create order/i }),
    ).not.toBeInTheDocument();
  });
});
