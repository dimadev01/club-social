import React from 'react';
import { Navigate } from 'react-router-dom';

import { RoleEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { DuesPage } from '@ui/pages/dues/DuesPage';
import { MemberDuesPage } from '@ui/pages/members/MemberDuesPage';

export const DuesRoot = () => {
  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Home} />;
  }

  if (user.profile?.role === RoleEnum.MEMBER) {
    return <MemberDuesPage />;
  }

  return <DuesPage />;
};
