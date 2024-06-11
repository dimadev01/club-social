import { Flex, Image, Space, Spin } from 'antd';
import React from 'react';

export const LoadingScreen: React.FC = () => (
  <Flex
    justify="center"
    align="center"
    className="h-full bg-white dark:bg-black"
  >
    <Space direction="vertical" align="center">
      <Image
        wrapperClassName="w-40"
        preview={false}
        src="/images/logo.png"
        alt="Rixsus Logo"
      />

      <Spin spinning />
    </Space>
  </Flex>
);
