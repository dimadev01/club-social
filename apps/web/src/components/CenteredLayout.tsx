import type { PropsWithChildren } from 'react';

import { Layout } from 'antd';

export function CenteredLayout({ children }: PropsWithChildren) {
  return (
    <Layout className="min-h-screen">
      <Layout.Content className="flex items-center justify-center">
        {children}
      </Layout.Content>
    </Layout>
  );
}
