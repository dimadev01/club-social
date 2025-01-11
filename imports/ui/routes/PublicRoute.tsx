import { useTracker } from 'meteor/react-meteor-data';
import React, { PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { AppUrl } from '@ui/app.enum';

export const PublicRoute: React.FC<PropsWithChildren> = () => {
  const { user } = useTracker(() => ({ user: Meteor.user() }));

  if (user) {
    return <Navigate to={AppUrl.HOME} />;
  }

  return <Outlet />;
};
