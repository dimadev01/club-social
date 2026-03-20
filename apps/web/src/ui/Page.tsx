import type { TitleProps } from 'antd/es/typography/Title';
import type { HTMLAttributes } from 'react';

import { Flex, type FlexProps, Spin, Typography } from 'antd';

import { cn } from '@/shared/lib/utils';

import { Card } from './Card';

export function Page(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}

export function PageActions({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props} />;
}

export function PageHeader({ children, className, ...props }: FlexProps) {
  return (
    <Flex
      align="center"
      className={cn('mb-8', className)}
      gap="middle"
      justify="space-between"
      wrap
      {...props}
    >
      {children}
    </Flex>
  );
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
      align="flex-start"
      className={cn('mb-2', className)}
      gap="middle"
      {...props}
    />
  );
}

export function PageTitle({ children, className, ...props }: TitleProps) {
  return (
    <Typography.Title className={cn('mb-0', className)} level={2} {...props}>
      {children}
    </Typography.Title>
  );
}
