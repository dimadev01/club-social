import { Navigate } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { LoginForm } from '@/auth/LoginForm';
import { betterAuthClient } from '@/shared/lib/better-auth.client';
import { CenteredLayout } from '@/ui';

export function LoginPage() {
  const { data: session } = betterAuthClient.useSession();

  if (session) {
    return <Navigate replace to={appRoutes.home} />;
  }

  return (
    <CenteredLayout>
      <LoginForm />
    </CenteredLayout>
  );
}
