import { useEffect } from 'react';

import { betterAuthClient } from '@/shared/lib/better-auth.client';
import { PageLoader } from '@/ui/Page';

export function LogoutPage() {
  useEffect(() => {
    betterAuthClient.signOut();
  }, []);

  return <PageLoader />;
}
