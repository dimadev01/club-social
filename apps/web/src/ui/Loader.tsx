import { type LoaderProps, Loader as MantineLoader } from '@mantine/core';

export function Loader({ ...props }: LoaderProps) {
  return <MantineLoader {...props} />;
}
