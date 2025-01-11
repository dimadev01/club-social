import { Flex, Space, Typography } from 'antd';
import React from 'react';
import { GiTennisBall } from 'react-icons/gi';

export const LoadingScreen: React.FC = () => (
  <Flex
    justify="center"
    align="center"
    className="h-full bg-white dark:bg-black"
  >
    <Space direction="vertical" align="center">
      <GiTennisBall className="icon-bounce" size={24} />
      <Typography.Text>Cargando</Typography.Text>
    </Space>
  </Flex>
);
