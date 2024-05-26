import React from 'react';
import { Navigate } from 'react-router-dom';

import { MemberPaymentsPage } from '../members/MemberPaymentsPage';

import { RoleEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { PaymentsPage } from '@ui/pages/payments/PaymentsPage';

export const PaymentsRoot = () => {
  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Home} />;
  }

  if (user.profile?.role === RoleEnum.Member) {
    return <MemberPaymentsPage />;
  }

  return <PaymentsPage />;
};
