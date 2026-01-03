import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { betterAuthClient } from '@/shared/lib/better-auth.client';
import { PageLoader } from '@/ui';

export function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await betterAuthClient.signOut();
      setTimeout(() => {
        console.log('navigate to login');
        navigate(appRoutes.auth.login, { replace: true });
      }, 1_000);
    };

    handleLogout();
  }, [navigate]);

  return <PageLoader />;
}
