import React from 'react';
import { Navigate } from 'react-router-dom';

import { AppUrl } from '@adapters/ui/app.enum';
import { DuesPage } from '@adapters/ui/pages/dues/DuesPage';

export const DuesRoot = () => {
  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Home} />;
  }

  return <DuesPage />;
};
