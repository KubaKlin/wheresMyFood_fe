import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import OrdersCurrent from './OrdersCurrent';
import { renderWithProviders } from '../test/test-utils';

vi.mock('../hooks/useOrdersCurrentPage', () => ({
  useOrdersCurrentPage: () => ({
    orders: [
      {
        id: 1,
        name: 'Order A',
        status: 'IN_PROGRESS',
        additionalInfo: '',
        items: [],
      },
    ],
    isLoading: false,
    error: null,
    isSaving: false,
    isCreateDialogOpen: false,
    createForm: { name: '', additionalInfo: '' },
    reload: vi.fn(),
    handleOpenCreateDialog: vi.fn(),
    handleCloseCreateDialog: vi.fn(),
    handleCreateNameChange: vi.fn(),
    handleCreateAdditionalInfoChange: vi.fn(),
    handleCreateSubmit: vi.fn(),
    handleToggleStatus: vi.fn(),
  }),
}));

describe('OrdersCurrent page', () => {
  it('it renders list header and an order', () => {
    renderWithProviders(<OrdersCurrent />);
    expect(screen.getByText('Current Orders')).toBeInTheDocument();
    expect(screen.getByText('Order A')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Create order/i }),
    ).toBeInTheDocument();
  });
});
