import { Card } from 'antd';
import React from 'react';
import { Navigate } from 'react-router-dom';

import { AppUrl } from '@ui/app.enum';
import { useIsMember } from '@ui/hooks/auth/useIsMember';

export const HomePage = () => {
  const isMember = useIsMember();

  // const isStaff = useIsStaff();

  // const isAdmin = useIsAdmin();

  if (isMember) {
    return <Navigate to={AppUrl.Dues} />;
  }

  // if (isStaff) {
  //   return <Navigate to={AppUrl.Payments} />;
  // }

  // if (isAdmin) {
  //   return <Navigate to={AppUrl.Members} />;
  // }

  return (
    <>
      <Card>Test2</Card>

      <Card>Test</Card>
    </>
  );
};
