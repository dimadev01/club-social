import { Navigate, Outlet } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { betterAuthClient } from '@/shared/lib/better-auth.client';

export function PublicRoute() {
  const { data: session } = betterAuthClient.useSession();

  if (session) {
    return <Navigate to={appRoutes.home} />;
  }

  return <Outlet />;
}
