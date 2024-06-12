import React, { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { AppUrl } from '@ui/app.enum';
import { Layout } from '@ui/components/Layout/Layout';
import { useUserContext } from '@ui/providers/UserContext';

export const AuthRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useUserContext();

  if (!user) {
    return <Navigate to={AppUrl.LOGIN} />;
  }

  return <Layout>{children}</Layout>;
};
