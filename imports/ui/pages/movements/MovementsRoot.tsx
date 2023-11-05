import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Navigate } from 'react-router-dom';
import { AppUrl } from '@ui/app.enum';
import { MovementsPage } from '@ui/pages/movements/MovementsPage';

export const MovementsRoot = () => {
  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Home} />;
  }

  return <MovementsPage />;
};
