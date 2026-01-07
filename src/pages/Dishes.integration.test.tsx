import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  screen,
  within,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dishes from './Dishes';
import { renderWithProviders } from '../test/test-utils';

const api = vi.hoisted(() => ({
  listDishes: vi.fn(),
  createDish: vi.fn(),
  updateDish: vi.fn(),
  deleteDish: vi.fn(),
}));

vi.mock('../api', () => api);

const mockResolvedValuesOnce = <TValue,>(
  mockFn: { mockResolvedValueOnce: (value: TValue) => unknown },
  values: TValue[],
) => {
  values.forEach((value) => {
    mockFn.mockResolvedValueOnce(value);
  });
};

describe('The Dishes (integration)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads dishes', async () => {
    api.listDishes.mockResolvedValueOnce([
      { id: 1, name: 'Burger', price: 25 },
    ]);

    renderWithProviders(<Dishes />);

    expect(await screen.findByText('Dishes')).toBeInTheDocument();
    expect(await screen.findByText('Burger')).toBeInTheDocument();
    expect(api.listDishes).toHaveBeenCalledTimes(1);
  });

  it('creates a dish', async () => {
    mockResolvedValuesOnce(api.listDishes, [
      [{ id: 1, name: 'Burger', price: 25 }],
      [
        { id: 1, name: 'Burger', price: 25 },
        { id: 2, name: 'Pizza', price: 30 },
      ],
    ]);
    api.createDish.mockResolvedValue({ id: 2, name: 'Pizza', price: 30 });

    renderWithProviders(<Dishes />);

    expect(await screen.findByText('Dishes')).toBeInTheDocument();
    expect(await screen.findByText('Burger')).toBeInTheDocument();

    const user = userEvent.setup();

    // Create dish
    await user.click(
      screen.getByRole('button', { name: /create a new dish/i }),
    );
    const createDialog = screen.getByRole('dialog', { name: /create dish/i });
    await user.type(within(createDialog).getByLabelText(/name/i), 'Pizza');
    await user.clear(within(createDialog).getByLabelText(/price/i));
    await user.type(within(createDialog).getByLabelText(/price/i), '30');
    await user.click(
      within(createDialog).getByRole('button', { name: /save dish/i }),
    );
    await waitForElementToBeRemoved(() =>
      screen.queryByRole('dialog', { name: /create dish/i }),
    );

    expect(api.createDish).toHaveBeenCalledWith({ name: 'Pizza', price: 30 });
    expect(await screen.findByText('Pizza')).toBeInTheDocument();
  });

  it('edits a dish', async () => {
    mockResolvedValuesOnce(api.listDishes, [
      [{ id: 1, name: 'Burger', price: 25 }],
      [{ id: 1, name: 'Burger XL', price: 40 }],
    ]);
    api.updateDish.mockResolvedValue({ id: 1, name: 'Burger XL', price: 40 });

    renderWithProviders(<Dishes />);

    // Edit dish
    const user = userEvent.setup();
    expect(await screen.findByText('Burger')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /edit dish burger/i }));
    const editDialog = screen.getByRole('dialog', { name: /edit dish/i });
    const nameField = within(editDialog).getByLabelText(/name/i);
    await user.clear(nameField);
    await user.type(nameField, 'Burger XL');
    const priceField = within(editDialog).getByLabelText(/price/i);
    await user.clear(priceField);
    await user.type(priceField, '40');
    await user.click(
      within(editDialog).getByRole('button', { name: /save dish/i }),
    );
    await waitForElementToBeRemoved(() =>
      screen.queryByRole('dialog', { name: /edit dish/i }),
    );

    expect(api.updateDish).toHaveBeenCalledWith(1, {
      name: 'Burger XL',
      price: 40,
    });
    expect(await screen.findByText('Burger XL')).toBeInTheDocument();
  });

  it('deletes a dish', async () => {
    mockResolvedValuesOnce(api.listDishes, [
      [{ id: 1, name: 'Burger', price: 25 }],
      [],
    ]);
    api.deleteDish.mockResolvedValue(undefined);

    renderWithProviders(<Dishes />);

    // Delete dish
    const user = userEvent.setup();
    expect(await screen.findByText('Burger')).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: /delete dish burger/i }),
    );
    const deleteDialog = screen.getByRole('dialog', { name: /delete dish/i });
    await user.click(
      within(deleteDialog).getByRole('button', { name: /^delete$/i }),
    );
    await waitForElementToBeRemoved(() =>
      screen.queryByRole('dialog', { name: /delete dish/i }),
    );

    expect(api.deleteDish).toHaveBeenCalledWith(1);
    expect(await screen.findByText('No dishes yet')).toBeInTheDocument();
  });
});
