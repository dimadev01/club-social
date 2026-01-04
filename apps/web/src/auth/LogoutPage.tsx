import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { betterAuthClient } from '@/shared/lib/better-auth.client';
import { PageLoader } from '@/ui';

export function LogoutPage() {
  const navigate = useNavigate();

  const { data: session } = betterAuthClient.useSession();

  useEffect(() => {
    const handleLogout = async () => {
      if (session) {
        await betterAuthClient.signOut();
      }

      setTimeout(() => {
        navigate(appRoutes.auth.login, { replace: true });
      }, 1_000);
    };

    handleLogout();
  }, [navigate, session]);

  return <PageLoader />;
}
