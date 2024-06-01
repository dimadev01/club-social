import React from 'react';
import { Navigate } from 'react-router-dom';

import { AppUrl } from '@adapters/ui/app.enum';
import { DuesPage } from '@adapters/ui/pages/dues/DuesPage';
import { MemberDuesPage } from '@adapters/ui/pages/members/MemberDuesPage';
import { RoleEnum } from '@domain/roles/role.enum';

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
