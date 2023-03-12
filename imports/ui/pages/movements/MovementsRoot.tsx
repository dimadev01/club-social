import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Navigate } from 'react-router-dom';
import { Role } from '@domain/roles/roles.enum';
import { AppUrl } from '@ui/app.enum';
import { MemberMovementsPage } from '@ui/pages/members/MemberMovementsPage';
import { MovementsPage } from '@ui/pages/movements/MovementsPage';

export const MovementsRoot = () => {
  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Home} />;
  }

  // @ts-expect-error
  if (user.profile?.role === Role.Member) {
    return <MemberMovementsPage />;
  }

  return <MovementsPage />;
};
