import type React from 'react';

import { Flex, type FlexProps } from 'antd';

import { cn } from '@/shared/lib/utils';

export function Page({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-4', className)} {...props} />;
}

export function PageContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <div className={cn('px-4', className)} {...props} />;
}

export function PageHeader({ className, ...props }: FlexProps) {
  return (
    <Flex
      align="center"
      className={cn('p-4', className)}
      gap="small"
      justify="space-between"
      wrap
      {...props}
    />
  );
}
