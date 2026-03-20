import type { TitleProps } from 'antd/es/typography/Title';
import type { HTMLAttributes } from 'react';

import { Flex, type FlexProps, Spin, Typography } from 'antd';

import { cn } from '@/shared/lib/utils';

import { BackButton } from './BackButton';
import { Card } from './Card';

interface PageHeaderProps extends FlexProps {
  backButton?: boolean;
}

export function Page(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}

export function PageActions({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props} />;
}

export function PageHeader({
  backButton = false,
  children,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <Flex
      align="center"
      className={cn('mb-8', className)}
      gap="middle"
      justify="space-between"
      wrap
      {...props}
    >
      {backButton ? (
        <Flex align="center" gap="small">
          <BackButton size="large" />
          {children}
        </Flex>
      ) : (
        children
      )}
    </Flex>
  );
}

export function PageHeading({ children, className, ...props }: TitleProps) {
  return (
    <Typography.Title className={cn(className)} level={3} {...props}>
      {children}
    </Typography.Title>
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
      className={cn('mb-4', className)}
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
