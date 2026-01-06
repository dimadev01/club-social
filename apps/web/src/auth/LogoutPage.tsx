import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useAppContext } from '@/app/AppContext';
import { betterAuthClient } from '@/shared/lib/better-auth.client';
import { PageLoader } from '@/ui';

export function LogoutPage() {
  const navigate = useNavigate();

  const { data: session } = betterAuthClient.useSession();

  const { resetPreferences } = useAppContext();

  useEffect(() => {
    const handleLogout = async () => {
      if (session) {
        await betterAuthClient.signOut();
      }

      setTimeout(() => {
        resetPreferences();
        navigate(appRoutes.auth.login, { replace: true });
      }, 1_000);
    };

    handleLogout();
  }, [navigate, resetPreferences, session]);

  return <PageLoader />;
}
