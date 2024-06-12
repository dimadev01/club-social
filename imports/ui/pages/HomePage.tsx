import { List, Typography } from 'antd';
import React from 'react';
import { Navigate } from 'react-router-dom';

import { AppUrl } from '@ui/app.enum';
import { DuesCard } from '@ui/components/Analytics/DuesCard';
import { MovementsCard } from '@ui/components/Analytics/MovementsCard';
import { PaymentsCard } from '@ui/components/Analytics/PaymentsCard';
import { useIsMember } from '@ui/hooks/auth/useIsMember';

export const HomePage = () => {
  const isMember = useIsMember();

  if (isMember) {
    return <Navigate to={AppUrl.DUES} />;
  }

  return (
    <>
      <Typography.Title level={1}>Club Social Monte Grande</Typography.Title>

      <List
        dataSource={[
          {
            component: <DuesCard />,
          },
          {
            component: <PaymentsCard />,
          },
          {
            component: <MovementsCard />,
          },
        ]}
        grid={{
          column: 2,
          gutter: [16, 16],
          sm: 1,
          xs: 1,
        }}
        renderItem={(item) => <List.Item>{item.component}</List.Item>}
      />
    </>
  );
};
