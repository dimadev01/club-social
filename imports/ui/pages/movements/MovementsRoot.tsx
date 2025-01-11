import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Navigate } from 'react-router-dom';

import { RoleEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { MovementsPage } from '@ui/pages/movements/MovementsPage';

export const MovementsRoot = () => {
  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.HOME} />;
  }

  if (user.profile?.role === RoleEnum.MEMBER) {
    return <Navigate to={AppUrl.HOME} />;
  }

  return <MovementsPage />;
};
