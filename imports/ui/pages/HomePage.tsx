import { Typography } from 'antd';
import React from 'react';
import { Navigate } from 'react-router-dom';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { AppUrl } from '@ui/app.enum';
import { DuesAndPaymentsBalanceCard } from '@ui/components/Analytics/DuesAndPaymentsBalanceCard';
import { Button } from '@ui/components/Button/Button';
import { useIsMember } from '@ui/hooks/auth/useIsMember';

export const HomePage = () => {
  const isMember = useIsMember();

  if (isMember) {
    return <Navigate to={AppUrl.DUES} />;
  }

  const handleLogin = async () => {
    /**
     * Send with form-data
     */

    try {
      const response = await Meteor.callAsync(MeteorMethodEnum.TestOpenresa);

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Typography.Title level={1}>Club Social Monte Grande</Typography.Title>

      <DuesAndPaymentsBalanceCard />

      <Button onClick={() => handleLogin()}>Login</Button>
    </>
  );
};
