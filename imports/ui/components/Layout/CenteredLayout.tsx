import React from 'react';
import { Card, Image, Layout } from 'antd';

type Props = {
  children: JSX.Element;
};

export const CenteredLayout: React.FC<Props> = ({ children }) => (
  <Layout className="min-h-full pt-24">
    <Card
      bordered={false}
      className="pt-10 md:pt-20 px-4 md:px-40 pb-8 md:pb-32 w-80 md:w-[670px] mx-auto rounded-bl-none rounded-tr-none rounded-tl-3xl rounded-br-3xl drop-shadow-xl mb-20"
      bodyStyle={{ padding: 0 }}
    >
      <Image
        wrapperClassName="w-full mb-16"
        preview={false}
        className="!w-36 mx-auto block"
        src="/images/logo.png"
        alt="Club Social logo"
      />

      {children}
    </Card>
  </Layout>
);
