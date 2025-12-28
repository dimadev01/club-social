import { Flex, type FlexProps, Spin } from 'antd';

import { cn } from '@/shared/lib/utils';

import { Card, type CardProps } from './Card';

export function Page({ ...props }: CardProps) {
  return <Card {...props} />;
}

export function PageLoader() {
  return (
    <Page className="flex items-center justify-center">
      <Spin size="large" />
    </Page>
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
