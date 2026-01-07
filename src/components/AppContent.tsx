import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import NavBar from './NavBar';
import SignUp from '../pages/SignUp';
import Login from '../pages/Login';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Dishes from '../pages/Dishes';
import OrdersCurrent from '../pages/OrdersCurrent';
import OrdersCompleted from '../pages/OrdersCompleted';
import OrderDetails from '../pages/OrderDetails';

const AppContent = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Container maxWidth="lg">
        <Box mt={4}>
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/orders/current" replace />}
            />
            <Route
              path="/sign-up"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/dishes"
              element={
                <PrivateRoute>
                  <Dishes />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders/current"
              element={
                <PrivateRoute>
                  <OrdersCurrent />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders/completed"
              element={
                <PrivateRoute>
                  <OrdersCompleted />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders/:orderId"
              element={
                <PrivateRoute>
                  <OrderDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={<Navigate to="/orders/current" replace />}
            />
          </Routes>
        </Box>
      </Container>
    </BrowserRouter>
  );
};

export default AppContent;
