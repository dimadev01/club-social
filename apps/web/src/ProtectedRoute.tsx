import { Navigate, Outlet } from 'react-router';

import { APP_ROUTES } from './app.enum';
import { useAppContext } from './context/app.context';

export function ProtectedRoute() {
  const { session } = useAppContext();

  if (!session) {
    return <Navigate to={APP_ROUTES.LOGIN} />;
  }

  return <Outlet />;
}
