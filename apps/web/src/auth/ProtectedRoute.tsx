import { Navigate, Outlet } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { AppLayout } from '@/app/AppLayout';
import { betterAuthClient } from '@/shared/lib/better-auth.client';

export function ProtectedRoute() {
  const { data: session } = betterAuthClient.useSession();

  if (!session) {
    return <Navigate to={appRoutes.auth.login} />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
