import React from 'react';
import { Navigate } from 'react-router-dom';

import { RoleEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { MemberPaymentsPage } from '@ui/pages/members/MemberPaymentsPage';
import { PaymentsPage } from '@ui/pages/payments/PaymentsPage';

export const PaymentsRoot = () => {
  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Home} />;
  }

  if (user.profile?.role === RoleEnum.MEMBER) {
    return <MemberPaymentsPage />;
  }

  return <PaymentsPage />;
};
