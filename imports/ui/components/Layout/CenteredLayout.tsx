import { Card, Image, Layout } from 'antd';
import React, { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';

export const CenteredLayout: React.FC<PropsWithChildren> = ({ children }) => (
  <Layout className="min-h-full pt-24">
    <Card
      styles={{ body: { padding: 0 } }}
      className="mx-auto mb-20 w-80 rounded-bl-none rounded-br-3xl rounded-tl-3xl rounded-tr-none px-4 pb-8 pt-10 drop-shadow-xl md:w-[670px] md:px-40 md:pb-32 md:pt-20"
    >
      <Image
        wrapperClassName="w-full mb-16"
        preview={false}
        className="mx-auto block !w-36"
        src="/images/logo.png"
        alt="Club Social logo"
      />

      <Outlet />
    </Card>
  </Layout>
);
