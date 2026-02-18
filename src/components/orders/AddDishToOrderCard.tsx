import {
  Button,
  FormHelperText,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Dish } from '../../types';
import type {
  AddDishToOrderFormValues,
  AddDishToOrderValidationRules,
} from '../../hooks/useOrderDetailsPage';
import type { Control, FieldErrors } from 'react-hook-form';

type AddDishToOrderCardProps = {
  dishes: Dish[];
  isSaving: boolean;
  control: Control<AddDishToOrderFormValues>;
  errors: FieldErrors<AddDishToOrderFormValues>;
  validationRules: AddDishToOrderValidationRules;
  onAdd: () => void | Promise<void>;
};

const AddDishToOrderCard = ({
  dishes,
  isSaving,
  control,
  errors,
  validationRules,
  onAdd,
}: AddDishToOrderCardProps) => {
  return (
    <Paper
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        void onAdd();
      }}
      sx={{ p: 2, mb: 2 }}
      aria-label="add dish to order"
    >
      <Typography variant="h6" gutterBottom>
        Add dish
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="stretch"
      >
        <Controller
          name="dishId"
          control={control}
          rules={validationRules.dishId}
          render={({ field }) => (
            <FormControl fullWidth error={Boolean(errors.dishId)}>
              <InputLabel id="dish-select-label">Dish</InputLabel>
              <Select
                labelId="dish-select-label"
                value={field.value}
                label="Dish"
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={isSaving}
                aria-label="Select dish"
              >
                <MenuItem value="">
                  <em>Select a dish</em>
                </MenuItem>
                {dishes.map((dish) => (
                  <MenuItem key={dish.id} value={String(dish.id)}>
                    {dish.name} — {dish.price}
                  </MenuItem>
                ))}
              </Select>
              {errors.dishId?.message && (
                <FormHelperText>{String(errors.dishId.message)}</FormHelperText>
              )}
            </FormControl>
          )}
        />

        <Controller
          name="quantity"
          control={control}
          rules={validationRules.quantity}
          render={({ field }) => (
            <TextField
              label="Quantity"
              type="number"
              value={Number.isFinite(field.value) ? field.value : ''}
              onChange={(event) => {
                const rawValue = event.target.value;
                if (rawValue === '') {
                  field.onChange(Number.NaN);
                  return;
                }
                field.onChange(Number(rawValue));
              }}
              onBlur={field.onBlur}
              disabled={isSaving}
              aria-label="Quantity"
              error={Boolean(errors.quantity)}
              helperText={
                errors.quantity?.message && String(errors.quantity.message)
              }
              sx={{ minWidth: 140 }}
            />
          )}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={isSaving}
          aria-label="Add selected dish to order"
          sx={{ whiteSpace: 'nowrap' }}
        >
          {isSaving ? 'Adding...' : 'Add'}
        </Button>
      </Stack>
    </Paper>
  );
};

export default AddDishToOrderCard;
