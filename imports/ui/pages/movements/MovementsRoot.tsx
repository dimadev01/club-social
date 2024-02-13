import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Navigate } from 'react-router-dom';
import { RoleEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { MovementsPage } from '@ui/pages/movements/MovementsPage';

export const MovementsRoot = () => {
  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Home} />;
  }

  // @ts-expect-error
  if (user.profile?.role === RoleEnum.Member) {
    return <Navigate to={AppUrl.Home} />;
  }

  return <MovementsPage />;
};
