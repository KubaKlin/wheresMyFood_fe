import { Box, Button, Typography } from '@mui/material';
import CenteredSpinner from '../components/common/CenteredSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import CreateOrderDialog from '../components/orders/CreateOrderDialog';
import OrdersList from '../components/orders/OrdersList';
import { getOrderStatusActionLabel } from '../components/orders/orderStatus';
import { useOrdersCurrentPage } from '../hooks/useOrdersCurrentPage';

const OrdersCurrent = () => {
  const {
    orders,
    isLoading,
    error,
    isSaving,
    isCreateDialogOpen,
    createForm,
    handleOpenCreateDialog,
    handleCloseCreateDialog,
    handleCreateNameChange,
    handleCreateAdditionalInfoChange,
    handleCreateSubmit,
    handleToggleStatus,
  } = useOrdersCurrentPage();

  if (isLoading) {
    return <CenteredSpinner ariaLabel="Loading current orders" />;
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={2}
      >
        <Typography variant="h4">Current Orders</Typography>
        <Button
          variant="contained"
          onClick={handleOpenCreateDialog}
          aria-label="Create order"
        >
          Create order
        </Button>
      </Box>

      {error && <ErrorAlert message={error} />}

      <OrdersList
        orders={orders}
        emptyLabel="No current orders yet"
        isActionsDisabled={isSaving}
        renderActions={(order) => (
          <Button
            variant="contained"
            onClick={() => handleToggleStatus(order)}
            aria-label={`${getOrderStatusActionLabel(order.status)} for order ${order.name}`}
            disabled={isSaving}
          >
            {getOrderStatusActionLabel(order.status)}
          </Button>
        )}
      />

      <CreateOrderDialog
        open={isCreateDialogOpen}
        isSaving={isSaving}
        formState={createForm}
        onClose={handleCloseCreateDialog}
        onNameChange={handleCreateNameChange}
        onAdditionalInfoChange={handleCreateAdditionalInfoChange}
        onSubmit={handleCreateSubmit}
      />
    </Box>
  );
};

export default OrdersCurrent;
