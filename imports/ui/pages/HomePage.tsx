import React from 'react';
import { Navigate } from 'react-router-dom';

import { AppUrl } from '@ui/app.enum';
import { InternalError } from '@ui/components/InternalError';
import { useIsAdmin } from '@ui/hooks/auth/useIsAdmin';
import { useIsMember } from '@ui/hooks/auth/useIsMember';
import { useIsStaff } from '@ui/hooks/auth/useIsStaff';

export const HomePage = () => {
  const isMember = useIsMember();

  const isStaff = useIsStaff();

  const isAdmin = useIsAdmin();

  if (isMember) {
    return <Navigate to={AppUrl.Dues} />;
  }

  if (isStaff) {
    return <Navigate to={AppUrl.Payments} />;
  }

  if (isAdmin) {
    return <Navigate to={AppUrl.Members} />;
  }

  return <InternalError />;
};
