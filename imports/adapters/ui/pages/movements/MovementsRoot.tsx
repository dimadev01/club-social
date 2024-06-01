import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Navigate } from 'react-router-dom';

import { AppUrl } from '@adapters/ui/app.enum';
import { MovementsPage } from '@adapters/ui/pages/movements/MovementsPage';
import { RoleEnum } from '@domain/roles/role.enum';

export const MovementsRoot = () => {
  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Home} />;
  }

  // @ts-expect-error
  if (user.profile?.role === RoleEnum.MEMBER) {
    return <Navigate to={AppUrl.Home} />;
  }

  return <MovementsPage />;
};
