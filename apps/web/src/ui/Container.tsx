import {
  type ContainerProps,
  Container as MantineContainer,
} from '@mantine/core';

export function Container({ children, ...props }: ContainerProps) {
  return (
    <MantineContainer size="xl" {...props}>
      {children}
    </MantineContainer>
  );
}
