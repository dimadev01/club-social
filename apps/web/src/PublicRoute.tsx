import { Navigate, Outlet } from 'react-router';

import { APP_ROUTES } from './app.enum';
import { useAppContext } from './context/app.context';

export function PublicRoute() {
  const { session } = useAppContext();

  if (session) {
    return <Navigate to={APP_ROUTES.ROOT} />;
  }

  return <Outlet />;
}
