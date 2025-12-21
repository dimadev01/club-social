import type { TitleProps } from 'antd/es/typography/Title';
import type React from 'react';

import { Flex, type FlexProps, Spin, Typography } from 'antd';

import { cn } from '@/shared/lib/utils';

import { Card, type CardProps } from './Card';

export function Page({ ...props }: CardProps) {
  return <Card {...props} />;
}

export function PageContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <div className={cn(className)} {...props} />;
}

export function PageHeader({ className, ...props }: FlexProps) {
  return (
    <Flex
      align="center"
      className={cn('mb-8', className)}
      gap="small"
      justify="space-between"
      wrap
      {...props}
    />
  );
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
      justify="space-between"
      wrap
      {...props}
    />
  );
}

export function PageTitle({ children, className, ...props }: TitleProps) {
  return (
    <Typography.Title className={cn('mb-0 text-2xl', className)} {...props}>
      {children}
    </Typography.Title>
  );
}
