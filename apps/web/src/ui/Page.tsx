import { Flex, type FlexProps, Spin } from 'antd';

import { cn } from '@/shared/lib/utils';

import { Card } from './Card';

export function Page(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}

export function PageLoader() {
  return (
    <Card className="flex h-screen items-center justify-center">
      <Spin size="large" />
    </Card>
  );
}

export function PageTableActions({ className, ...props }: FlexProps) {
  return (
    <Flex
      align="center"
      className={cn('mb-8', className)}
      gap="middle"
      wrap
      {...props}
    />
  );
}
