import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, Outlet } from 'react-router';

import { AppLayout } from '@/app/AppLayout';

import { APP_ROUTES } from '../app/app.enum';

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN} />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
