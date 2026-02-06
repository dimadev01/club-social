import { UserRole } from '@club-social/shared/users';
import { usePostHog } from '@posthog/react';
import { useEffect, useRef } from 'react';
import { Navigate, Outlet } from 'react-router';

import { useMaintenanceMode } from '@/app-settings/useMaintenanceMode';
import { appRoutes } from '@/app/app.enum';
import { AppLayout } from '@/app/AppLayout';
import { AppLoading } from '@/app/AppLoading';
import { MaintenancePage } from '@/maintenance/MaintenancePage';
import { betterAuthClient } from '@/shared/lib/better-auth.client';

export function ProtectedRoute() {
  const posthog = usePostHog();
  const identifiedRef = useRef(false);
  const { data: session } = betterAuthClient.useSession();
  const { data: maintenanceMode, isLoading: isMaintenanceLoading } =
    useMaintenanceMode();

  useEffect(() => {
    if (session && !identifiedRef.current) {
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      });
      identifiedRef.current = true;
    }
  }, [posthog, session]);

  if (!session) {
    return <Navigate to={appRoutes.auth.login} />;
  }

  if (isMaintenanceLoading) {
    return <AppLoading />;
  }

  const isAdmin = session.user.role === UserRole.ADMIN;
  const isMaintenanceModeEnabled = maintenanceMode?.value.enabled ?? false;

  if (isMaintenanceModeEnabled && !isAdmin) {
    return <MaintenancePage />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
