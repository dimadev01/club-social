import { Typography } from 'antd';
import React from 'react';
import { Navigate } from 'react-router-dom';

import { AppUrl } from '@ui/app.enum';
import { DuesAndPaymentsBalanceCard } from '@ui/components/Analytics/DuesAndPaymentsBalanceCard';
import { useIsMember } from '@ui/hooks/auth/useIsMember';

export const HomePage = () => {
  const isMember = useIsMember();

  if (isMember) {
    return <Navigate to={AppUrl.DUES} />;
  }

  return (
    <>
      <Typography.Title level={1}>Club Social Monte Grande</Typography.Title>

      <DuesAndPaymentsBalanceCard />
    </>
  );
};
