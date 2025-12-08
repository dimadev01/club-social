import { useEffect } from 'react';

import { AppLoading } from '@/app/AppLoading';
import { betterAuthClient } from '@/shared/lib/better-auth.client';

export function LogoutPage() {
  useEffect(() => {
    betterAuthClient.signOut();
  }, []);

  return <AppLoading />;
}
