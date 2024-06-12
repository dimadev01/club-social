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
      <Typography.Title level={1}>Inicio</Typography.Title>

      <List
        dataSource={[
          { component: <DuesCard /> },
          { component: <PaymentsCard /> },
          { component: <MovementsCard /> },
        ]}
        grid={{
          gutter: [16, 16],
          lg: 2,
          md: 1,
          sm: 1,
          xl: 3,
          xs: 1,
          xxl: 4,
        }}
        renderItem={(item) => <List.Item>{item.component}</List.Item>}
      />
    </>
  );
};
