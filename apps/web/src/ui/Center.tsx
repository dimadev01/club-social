import { type CenterProps, Center as MantineCenter } from '@mantine/core';

export function Center({ children, ...props }: CenterProps) {
  return <MantineCenter {...props}>{children}</MantineCenter>;
}
