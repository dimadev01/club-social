import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

import { AppLoading } from '@/app/AppLoading';

export function LogoutPage() {
  const { logout } = useAuth0();

  useEffect(() => {
    logout();
  }, [logout]);

  return <AppLoading />;
}
