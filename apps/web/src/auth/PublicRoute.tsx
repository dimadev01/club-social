import { Navigate, Outlet } from 'react-router';

import { useAppContext } from '@/app/app.context';
import { APP_ROUTES } from '@/app/app.enum';

export function PublicRoute() {
  const { session } = useAppContext();

  if (session) {
    return <Navigate to={APP_ROUTES.ROOT} />;
  }

  return <Outlet />;
}
