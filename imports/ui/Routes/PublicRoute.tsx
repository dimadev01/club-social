import React from 'react';
import { Navigate } from 'react-router-dom';
import { AppUrl } from '@ui/app.enum';

type Props = {
  children: JSX.Element;
};

export const PublicRoute: React.FC<Props> = ({ children }) => {
  const user = Meteor.user();

  if (user) {
    return <Navigate to={AppUrl.Home} />;
  }

  return children;
};
