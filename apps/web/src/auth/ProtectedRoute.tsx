import { Navigate, Outlet } from 'react-router';

import { useAppContext } from '@/app/app.context';
import { AppLayout } from '@/app/AppLayout';

import { APP_ROUTES } from '../app/app.enum';

export function ProtectedRoute() {
  const { session } = useAppContext();

  if (!session) {
    return <Navigate to={APP_ROUTES.LOGIN} />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
