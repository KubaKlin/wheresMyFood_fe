import type { ChangeEvent } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import type { Dish } from '../../types';

type AddDishToOrderCardProps = {
  dishes: Dish[];
  selectedDishId: string;
  quantity: string;
  isSaving: boolean;
  onSelectedDishChange: (event: SelectChangeEvent<string>) => void;
  onQuantityChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
};

const AddDishToOrderCard = ({
  dishes,
  selectedDishId,
  quantity,
  isSaving,
  onSelectedDishChange,
  onQuantityChange,
  onAdd,
}: AddDishToOrderCardProps) => {
  return (
    <Paper sx={{ p: 2, mb: 2 }} aria-label="add dish to order">
      <Typography variant="h6" gutterBottom>
        Add dish
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="stretch"
      >
        <FormControl fullWidth>
          <InputLabel id="dish-select-label">Dish</InputLabel>
          <Select
            labelId="dish-select-label"
            value={selectedDishId}
            label="Dish"
            onChange={onSelectedDishChange}
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
        </FormControl>
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={onQuantityChange}
          disabled={isSaving}
          inputProps={{ min: 1, step: 1 }}
          aria-label="Quantity"
          sx={{ minWidth: 140 }}
        />
        <Button
          variant="contained"
          onClick={onAdd}
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
