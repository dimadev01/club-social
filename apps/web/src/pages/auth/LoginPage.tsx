import { Center } from '@mantine/core';

import { LoginForm } from '@/ui/login-form';

export function LoginPage() {
  return (
    <Center h="75vh" mx="auto" px="md" w={400}>
      <LoginForm />
    </Center>
  );
}
