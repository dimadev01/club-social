import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Navigate } from 'react-router-dom';

import { AppUrl } from '@adapters/ui/app.enum';
import { RoleEnum } from '@domain/roles/role.enum';

export const HomePage = () => {
  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Logout} />;
  }

  if (user.profile?.role === RoleEnum.MEMBER) {
    return <Navigate to={AppUrl.Dues} />;
  }

  return <Navigate to={AppUrl.Payments} />;
};
