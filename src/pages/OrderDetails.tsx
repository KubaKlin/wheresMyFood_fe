import { useParams } from 'react-router-dom';
import { Alert, Box, Button, Chip, Stack, Typography } from '@mui/material';
import CenteredSpinner from '../components/common/CenteredSpinner';
import AddDishToOrderCard from '../components/orders/AddDishToOrderCard';
import OrderItemsCard from '../components/orders/OrderItemsCard';
import QrDialog from '../components/orders/QrDialog';
import {
  getOrderStatusActionLabel,
  getOrderStatusLabel,
} from '../components/orders/orderStatus';
import { useOrderDetailsPage } from '../hooks/useOrderDetailsPage';

const OrderDetails = () => {
  const params = useParams();
  const orderId = Number(params.orderId);
  const {
    order,
    dishes,
    isLoading,
    isSaving,
    selectedDishId,
    quantity,
    isQrDialogOpen,
    qrData,
    qrError,
    qrPayload,
    handleSelectedDishChange,
    handleQuantityChange,
    handleAddDish,
    handleToggleStatus,
    handleOpenQrDialog,
    handleCloseQrDialog,
  } = useOrderDetailsPage(orderId);

  if (isLoading) {
    return <CenteredSpinner ariaLabel="Loading order details" />;
  }

  if (!order) {
    return (
      <Alert severity="error" role="alert">
        Order not found
      </Alert>
    );
  }

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={2}
        mb={2}
      >
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="h4">
            {order.name ? order.name : `Order #${order.id}`}
          </Typography>
          <Chip
            label={getOrderStatusLabel(order.status)}
            color={order.status === 'READY_TO_TAKE' ? 'success' : 'warning'}
            aria-label={`Order status ${getOrderStatusLabel(order.status)}`}
          />
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            onClick={handleToggleStatus}
            disabled={isSaving}
            aria-label={getOrderStatusActionLabel(order.status)}
          >
            {getOrderStatusActionLabel(order.status)}
          </Button>
          <Button
            variant="outlined"
            onClick={handleOpenQrDialog}
            aria-label="Show QR code"
          >
            Show QR
          </Button>
        </Stack>
      </Stack>

      {order.additionalInfo && (
        <Alert severity="info" sx={{ mb: 2 }} aria-label="Additional info">
          {order.additionalInfo}
        </Alert>
      )}

      <AddDishToOrderCard
        dishes={dishes}
        selectedDishId={selectedDishId}
        quantity={quantity}
        isSaving={isSaving}
        onSelectedDishChange={handleSelectedDishChange}
        onQuantityChange={handleQuantityChange}
        onAdd={handleAddDish}
      />

      <OrderItemsCard items={order.items} />

      <QrDialog
        open={isQrDialogOpen}
        qrData={qrData}
        error={qrError}
        isLoading={isQrDialogOpen && !qrData && !qrError}
        qrPayload={qrPayload}
        onClose={handleCloseQrDialog}
      />
    </Box>
  );
};

export default OrderDetails;
