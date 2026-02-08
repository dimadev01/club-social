import { usePostHog } from '@posthog/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useAppContext } from '@/app/AppContext';
import { betterAuthClient } from '@/shared/lib/better-auth.client';
import { PostHogEvent } from '@/shared/lib/posthog-events';
import { PageLoader } from '@/ui';

export function LogoutPage() {
  const navigate = useNavigate();
  const posthog = usePostHog();

  const { data: session } = betterAuthClient.useSession();

  const { resetPreferences } = useAppContext();

  useEffect(() => {
    const handleLogout = async () => {
      if (session) {
        posthog.capture(PostHogEvent.LOGOUT_COMPLETED);
        posthog.reset();
        await betterAuthClient.signOut();
      }

      setTimeout(() => {
        resetPreferences();
        navigate(appRoutes.auth.login, { replace: true });
      }, 1_000);
    };

    handleLogout();
  }, [navigate, posthog, resetPreferences, session]);

  return <PageLoader />;
}
