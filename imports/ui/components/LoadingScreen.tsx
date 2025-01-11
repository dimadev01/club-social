import { Flex, Space, Typography } from 'antd';
import React from 'react';

import { TennisBallIcon } from '@ui/components/Icons/TennisBall';

export const LoadingScreen: React.FC = () => (
  <Flex
    justify="center"
    align="center"
    className="h-full bg-white dark:bg-black"
  >
    <Space direction="vertical" align="center">
      <TennisBallIcon />
      <Typography.Text>Cargando</Typography.Text>
    </Space>
  </Flex>
);
