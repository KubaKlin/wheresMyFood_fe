import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { Dish } from '../../types';

export type CreateOrderDraftDishState = {
  dishId: string;
  quantity: number;
};

export type CreateOrderDraftItem = {
  dishId: number;
  quantity: number;
};

export type CreateOrderDishesSectionProps = {
  dishes: Dish[];
  isSaving: boolean;
  isDishesLoading: boolean;
  draftDish: CreateOrderDraftDishState;
  draftItems: CreateOrderDraftItem[];
  onDraftDishIdChange: (dishId: string) => void;
  onDraftDishQuantityChange: (quantity: number) => void;
  onAddDraftDish: () => void;
  onRemoveDraftDish: (dishId: number) => void;
  onDraftItemQuantityChange: (dishId: number, quantity: number) => void;
};

const CreateOrderDishesSection = ({
  dishes,
  isSaving,
  isDishesLoading,
  draftDish,
  draftItems,
  onDraftDishIdChange,
  onDraftDishQuantityChange,
  onAddDraftDish,
  onRemoveDraftDish,
  onDraftItemQuantityChange,
}: CreateOrderDishesSectionProps) => {
  return (
    <Paper variant="outlined" sx={{ p: 2 }} aria-label="Add dishes to order">
      <Typography variant="h6" gutterBottom>
        Dishes (optional)
      </Typography>

      {dishes.length === 0 && !isDishesLoading ? (
        <Alert severity="info" aria-label="No dishes available">
          No dishes yet. You can create the order now and add dishes later.
        </Alert>
      ) : (
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="stretch"
          >
            <FormControl
              fullWidth
              disabled={isSaving || isDishesLoading}
              aria-label="Dish picker"
            >
              <InputLabel id="create-order-dish-select-label">Dish</InputLabel>
              <Select
                labelId="create-order-dish-select-label"
                value={draftDish.dishId}
                label="Dish"
                onChange={(event) =>
                  onDraftDishIdChange(String(event.target.value ?? ''))
                }
                aria-label="Select dish for new order"
              >
                <MenuItem value="">
                  <em>{isDishesLoading ? 'Loading dishes...' : 'Select a dish'}</em>
                </MenuItem>
                {dishes.map((dish) => (
                  <MenuItem key={dish.id} value={String(dish.id)}>
                    {dish.name} — {dish.price}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {isDishesLoading ? 'Loading...' : 'Pick a dish to add'}
              </FormHelperText>
            </FormControl>

            <TextField
              label="Quantity"
              type="number"
              value={Number.isFinite(draftDish.quantity) ? draftDish.quantity : ''}
              onChange={(event) => {
                const rawValue = event.target.value;
                if (rawValue === '') {
                  onDraftDishQuantityChange(Number.NaN);
                  return;
                }
                onDraftDishQuantityChange(Number(rawValue));
              }}
              disabled={isSaving || isDishesLoading}
              aria-label="Dish quantity"
              sx={{ minWidth: 140 }}
            />

            <Button
              variant="contained"
              onClick={onAddDraftDish}
              disabled={isSaving || isDishesLoading}
              aria-label="Add selected dish to new order"
              sx={{ whiteSpace: 'nowrap' }}
            >
              Add
            </Button>
          </Stack>

          {draftItems.length > 0 && (
            <Stack spacing={1} aria-label="Selected dishes list">
              {draftItems.map((item) => {
                const dish = dishes.find((d) => d.id === item.dishId);
                const label = dish ? dish.name : `Dish #${item.dishId}`;

                return (
                  <Stack
                    key={item.dishId}
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                  >
                    <Typography sx={{ flex: 1 }} aria-label="Dish name">
                      {label}
                    </Typography>
                    <TextField
                      label="Qty"
                      type="number"
                      value={Number.isFinite(item.quantity) ? item.quantity : ''}
                      onChange={(event) => {
                        const rawValue = event.target.value;
                        if (rawValue === '') {
                          onDraftItemQuantityChange(item.dishId, Number.NaN);
                          return;
                        }
                        onDraftItemQuantityChange(item.dishId, Number(rawValue));
                      }}
                      disabled={isSaving}
                      aria-label={`Quantity for ${label}`}
                      sx={{ width: 140 }}
                    />
                    <Button
                      variant="text"
                      color="error"
                      onClick={() => onRemoveDraftDish(item.dishId)}
                      disabled={isSaving}
                      aria-label={`Remove ${label} from new order`}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      Remove
                    </Button>
                  </Stack>
                );
              })}
            </Stack>
          )}
        </Stack>
      )}
    </Paper>
  );
};

export default CreateOrderDishesSection;
