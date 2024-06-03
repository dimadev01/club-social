import React from 'react';
import { Navigate } from 'react-router-dom';

import { AppUrl } from '@ui/app.enum';
import { PaymentsPage } from '@ui/pages/payments/PaymentsPage';

export const PaymentsRoot = () => {
  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Home} />;
  }

  return <PaymentsPage />;
};
