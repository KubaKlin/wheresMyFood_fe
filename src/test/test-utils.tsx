import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import type { Restaurant } from '../types';

type RenderWithProvidersOptions = {
  route?: string;
  isAuthenticated?: boolean;
  isLoading?: boolean;
  restaurant?: Restaurant | null;
};

export const renderWithProviders = (
  ui: ReactElement,
  {
    route = '/',
    isAuthenticated = true,
    isLoading = false,
    restaurant = null,
  }: RenderWithProvidersOptions = {},
) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthContext.Provider
        value={{
          isAuthenticated,
          isLoading,
          restaurant,
          handleLoginSuccess: () => {},
          handleLogout: async () => {},
          refreshAuth: async () => {},
        }}
      >
        {ui}
      </AuthContext.Provider>
    </MemoryRouter>,
  );
};

type RenderWithRouteOptions = RenderWithProvidersOptions & {
  route: string;
  path: string;
};

export const renderWithRoute = (
  ui: ReactElement,
  { route, path, ...providerOptions }: RenderWithRouteOptions,
) => {
  return renderWithProviders(
    <Routes>
      <Route path={path} element={ui} />
    </Routes>,
    { ...providerOptions, route },
  );
};
