import type React from 'react';

import { Flex, type FlexProps } from 'antd';

import { cn } from '@/shared/lib/utils';

export function Page({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('p-4 md:p-10', className)} {...props} />;
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
