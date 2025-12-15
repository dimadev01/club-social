import type { TitleProps } from 'antd/es/typography/Title';
import type React from 'react';

import {
  Card,
  type CardProps,
  Flex,
  type FlexProps,
  Spin,
  Typography,
} from 'antd';

import { cn } from '@/shared/lib/utils';

export function Page({ className, ...props }: CardProps) {
  return <Card className={cn('h-full', className)} {...props} />;
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

export function PageTitle({ children, className, ...props }: TitleProps) {
  return (
    <Typography.Title className={cn('mb-0 text-2xl', className)} {...props}>
      {children}
    </Typography.Title>
  );
}
