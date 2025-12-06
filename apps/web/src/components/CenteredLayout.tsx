import { Layout, type LayoutProps } from 'antd';

import { cn } from '@/shared/lib/utils';

export function CenteredLayout({ children, className, ...props }: LayoutProps) {
  return (
    <Layout className={cn('h-screen', className)} {...props}>
      <Layout.Content className="flex items-center justify-center px-4">
        {children}
      </Layout.Content>
    </Layout>
  );
}
