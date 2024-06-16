import { Typography } from 'antd';
import React from 'react';

import { DuesAndPaymentsBalanceCard } from '@ui/components/Analytics/DuesAndPaymentsBalanceCard';
import { DuesByMemberAnalytics } from '@ui/components/Analytics/DuesByMemberAnalytics';
import { usePermissions } from '@ui/hooks/auth/usePermissions';

export const HomePage = () => {
  const permissions = usePermissions();

  if (permissions.isMember) {
    return <DuesByMemberAnalytics />;
  }

  return (
    <>
      <Typography.Title level={1}>Club Social Monte Grande</Typography.Title>

      <DuesAndPaymentsBalanceCard />
    </>
  );
};
