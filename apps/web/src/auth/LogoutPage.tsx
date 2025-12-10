import { useEffect } from 'react';

import { PageLoader } from '@/components/Page';
import { betterAuthClient } from '@/shared/lib/better-auth.client';

export function LogoutPage() {
  useEffect(() => {
    betterAuthClient.signOut();
  }, []);

  return <PageLoader />;
}
