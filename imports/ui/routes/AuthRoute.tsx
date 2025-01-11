import React, { PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { AppUrl } from '@ui/app.enum';
import { Layout } from '@ui/components/Layout/Layout';
import { useUserContext } from '@ui/providers/UserContext';

export const AuthRoute: React.FC<PropsWithChildren> = () => {
  const { user } = useUserContext();

  if (!user) {
    return <Navigate to={`${AppUrl.AUTH}/${AppUrl.AUTH_LOGIN}`} />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
