import { Navigate, Outlet } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { betterAuthClient } from '@/shared/lib/better-auth.client';

export function PublicRoute() {
  const { data: session } = betterAuthClient.useSession();

  if (session) {
    return <Navigate to={APP_ROUTES.HOME} />;
  }

  return <Outlet />;
}
