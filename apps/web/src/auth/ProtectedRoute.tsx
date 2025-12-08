import { Navigate, Outlet } from 'react-router';

import { AppLayout } from '@/app/AppLayout';
import { betterAuthClient } from '@/shared/lib/better-auth.client';

import { APP_ROUTES } from '../app/app.enum';

export function ProtectedRoute() {
  const { data: session } = betterAuthClient.useSession();

  if (!session) {
    return <Navigate to={APP_ROUTES.LOGIN} />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
