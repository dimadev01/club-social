import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Navigate } from 'react-router-dom';
import { RoleEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';

export const HomePage = () => {
  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Logout} />;
  }

  if (user.profile?.role === RoleEnum.Member) {
    return <Navigate to={AppUrl.Dues} />;
  }

  return <Navigate to={AppUrl.Payments} />;
};
