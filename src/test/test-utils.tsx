import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import type { AuthPrincipal } from '../types';

type RenderWithProvidersOptions = {
  route?: string;
  isAuthenticated?: boolean;
  isLoading?: boolean;
  principal?: AuthPrincipal | null;
};

export const renderWithProviders = (
  ui: ReactElement,
  {
    route = '/',
    isAuthenticated = true,
    isLoading = false,
    principal = null,
  }: RenderWithProvidersOptions = {},
) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthContext.Provider
        value={{
          isAuthenticated,
          isLoading,
          principal,
          handleLoginSuccess: async () => {},
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
