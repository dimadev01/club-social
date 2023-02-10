import React from 'react';
import { Navigate } from 'react-router-dom';
import { AppUrl } from '@ui/app.enum';
import { Layout } from '@ui/Layout';

type Props = {
  children: JSX.Element;
};

export const AuthRoute: React.FC<Props> = ({ children }) => {
  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.LOGIN} />;
  }

  return <Layout>{children}</Layout>;
};
