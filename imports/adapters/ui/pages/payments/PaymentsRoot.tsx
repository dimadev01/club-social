import React from 'react';
import { Navigate } from 'react-router-dom';

import { AppUrl } from '@adapters/ui/app.enum';
import { MemberPaymentsPage } from '@adapters/ui/pages/members/MemberPaymentsPage';
import { PaymentsPage } from '@adapters/ui/pages/payments/PaymentsPage';
import { RoleEnum } from '@domain/roles/role.enum';

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
