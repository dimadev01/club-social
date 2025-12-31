import { UserRole } from '@club-social/shared/users';
import { Navigate, Outlet } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { AppLayout } from '@/app/AppLayout';
import { AppLoading } from '@/app/AppLoading';
import { useMaintenanceMode } from '@/feature-flags/useMaintenanceMode';
import { MaintenancePage } from '@/maintenance/MaintenancePage';
import { betterAuthClient } from '@/shared/lib/better-auth.client';

export function ProtectedRoute() {
  const { data: session } = betterAuthClient.useSession();
  const { data: maintenanceMode, isLoading: isMaintenanceLoading } =
    useMaintenanceMode();

  if (!session) {
    return <Navigate to={appRoutes.auth.login} />;
  }

  if (isMaintenanceLoading) {
    return <AppLoading />;
  }

  const isAdmin = session.user.role === UserRole.ADMIN;
  const isMaintenanceModeEnabled = maintenanceMode?.enabled ?? false;

  if (isMaintenanceModeEnabled && !isAdmin) {
    return <MaintenancePage />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
