import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderDetails from './OrderDetails';
import { renderWithRoute } from '../test/test-utils';

const api = vi.hoisted(() => ({
  getPublicOrderStatus: vi.fn(),
  listDishes: vi.fn(),
  addOrderItem: vi.fn(),
  updateOrderStatus: vi.fn(),
  getOrderQr: vi.fn(),
}));

vi.mock('../api', () => api);

describe('the OrderDetails (integration)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads order details', async () => {
    api.getPublicOrderStatus.mockResolvedValueOnce({
      id: 9,
      name: 'Order #9',
      status: 'IN_PROGRESS',
      additionalInfo: '',
      items: [],
    });
    api.listDishes.mockResolvedValueOnce([{ id: 2, name: 'Pizza', price: 30 }]);

    renderWithRoute(<OrderDetails />, {
      route: '/orders/9',
      path: '/orders/:orderId',
    });

    expect(await screen.findByText(/order #9/i)).toBeInTheDocument();
    expect(api.getPublicOrderStatus).toHaveBeenCalledTimes(1);
    expect(api.listDishes).toHaveBeenCalledTimes(1);
  });

  it('adds a dish item to the order', async () => {
    api.getPublicOrderStatus
      .mockResolvedValueOnce({
        id: 9,
        name: 'Order #9',
        status: 'IN_PROGRESS',
        additionalInfo: '',
        items: [],
      })
      .mockResolvedValueOnce({
        id: 9,
        name: 'Order #9',
        status: 'IN_PROGRESS',
        additionalInfo: '',
        items: [
          {
            id: 1,
            dishId: 2,
            quantity: 2,
            dish: { id: 2, name: 'Pizza', price: 30 },
          },
        ],
      });
    api.listDishes.mockResolvedValue([{ id: 2, name: 'Pizza', price: 30 }]);
    api.addOrderItem.mockResolvedValueOnce(undefined);

    renderWithRoute(<OrderDetails />, {
      route: '/orders/9',
      path: '/orders/:orderId',
    });

    expect(await screen.findByText(/order #9/i)).toBeInTheDocument();

    const user = userEvent.setup();
    const dishSelect = screen.getByRole('combobox', { name: /dish/i });
    fireEvent.mouseDown(dishSelect);
    const listbox = await screen.findByRole('listbox');
    await user.click(within(listbox).getByText(/pizza/i));

    const qty = screen.getByRole('spinbutton', { name: /quantity/i });
    await user.clear(qty);
    await user.type(qty, '2');

    await user.click(
      screen.getByRole('button', { name: /add selected dish to order/i }),
    );

    expect(api.addOrderItem).toHaveBeenCalledWith(9, {
      dishId: 2,
      quantity: 2,
    });
    const itemsCard = screen.getByLabelText(/order items/i);
    expect(await within(itemsCard).findByText('Pizza')).toBeInTheDocument();
    expect(await within(itemsCard).findByText(/x2/i)).toBeInTheDocument();
  });

  it('toggles order status', async () => {
    api.getPublicOrderStatus
      .mockResolvedValueOnce({
        id: 9,
        name: 'Order #9',
        status: 'IN_PROGRESS',
        additionalInfo: '',
        items: [],
      })
      .mockResolvedValueOnce({
        id: 9,
        name: 'Order #9',
        status: 'READY_TO_TAKE',
        additionalInfo: '',
        items: [],
      });
    api.listDishes.mockResolvedValue([]);
    api.updateOrderStatus.mockResolvedValueOnce({
      id: 9,
      name: 'Order #9',
      status: 'READY_TO_TAKE',
    });

    renderWithRoute(<OrderDetails />, {
      route: '/orders/9',
      path: '/orders/:orderId',
    });
    expect(await screen.findByText(/order #9/i)).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /mark ready/i }));
    expect(api.updateOrderStatus).toHaveBeenCalledWith(9, 'READY_TO_TAKE');
    expect(await screen.findByText(/order completed/i)).toBeInTheDocument();
  });

  it('opens QR dialog', async () => {
    api.getPublicOrderStatus.mockResolvedValueOnce({
      id: 9,
      name: 'Order #9',
      status: 'IN_PROGRESS',
      additionalInfo: '',
      items: [],
    });
    api.listDishes.mockResolvedValue([]);
    api.getOrderQr.mockResolvedValueOnce({
      statusUrl: 'http://client.local/o/9',
    });

    renderWithRoute(<OrderDetails />, {
      route: '/orders/9',
      path: '/orders/:orderId',
    });
    expect(await screen.findByText(/order #9/i)).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /show qr code/i }));
    expect(api.getOrderQr).toHaveBeenCalledWith(9);
    expect(
      await screen.findByRole('dialog', { name: /client qr/i }),
    ).toBeInTheDocument();
    expect(screen.getByAltText(/order status qr code/i)).toBeInTheDocument();
  });
});
