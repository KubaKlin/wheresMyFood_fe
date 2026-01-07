import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import Dishes from './Dishes';
import { renderWithProviders } from '../test/test-utils';

vi.mock('../hooks/useDishesPage', () => ({
  useDishesPage: () => ({
    dishes: [{ id: 1, name: 'Burger', price: 25 }],
    isLoading: false,
    error: null,
    isSaving: false,
    isCreateDialogOpen: false,
    isEditDialogOpen: false,
    isDeleteDialogOpen: false,
    dishToEdit: null,
    dishToDelete: null,
    formState: { name: '', price: '' },
    loadDishes: vi.fn(),
    handleOpenCreateDialog: vi.fn(),
    handleCloseCreateDialog: vi.fn(),
    handleOpenEditDialog: vi.fn(),
    handleCloseEditDialog: vi.fn(),
    handleOpenDeleteDialog: vi.fn(),
    handleCloseDeleteDialog: vi.fn(),
    handleNameChange: vi.fn(),
    handlePriceChange: vi.fn(),
    handleCreateSubmit: vi.fn(),
    handleEditSubmit: vi.fn(),
    handleConfirmDelete: vi.fn(),
  }),
}));

describe('the Dishes page', () => {
  it('renders dishes table and create button', () => {
    renderWithProviders(<Dishes />);
    expect(screen.getByText('Dishes')).toBeInTheDocument();
    expect(screen.getByText('Burger')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Create a new dish/i }),
    ).toBeInTheDocument();
  });
});
