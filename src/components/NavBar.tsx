import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const NavBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, handleLogout } = useAuth();

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Button
          color="inherit"
          component={Link}
          to={isAuthenticated ? '/orders/current' : '/login'}
          aria-label="Go to home"
        >
          Where’s My Food
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {isAuthenticated ? (
          <>
            <Button
              color="inherit"
              component={Link}
              to="/dishes"
              aria-label="Go to dishes"
            >
              Dishes
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/orders/current"
              aria-label="Go to current orders"
            >
              Current Orders
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/orders/completed"
              aria-label="Go to completed orders"
            >
              Completed
            </Button>
            <Button
              color="inherit"
              onClick={handleLogoutClick}
              aria-label="Log out"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/sign-up">
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
