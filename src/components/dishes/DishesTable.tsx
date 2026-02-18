import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import type { Dish } from '../../types';

type DishesTableProps = {
  dishes: Dish[];
  onEditDish: (dish: Dish) => void;
  onDeleteDish: (dish: Dish) => void;
};

const formatPrice = (price: number) => `${price.toFixed(0)}`;

const DishesTable = ({
  dishes,
  onEditDish,
  onDeleteDish,
}: DishesTableProps) => {
  return (
    <TableContainer component={Paper} aria-label="dishes table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dishes.length > 0 ? (
            dishes.map((dish) => (
              <TableRow key={dish.id} hover>
                <TableCell>{dish.name}</TableCell>
                <TableCell align="right">{formatPrice(dish.price)}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={() => onEditDish(dish)}
                      aria-label={`Edit dish ${dish.name}`}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => onDeleteDish(dish)}
                      aria-label={`Delete dish ${dish.name}`}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>No dishes yet</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DishesTable;
