import { Center } from '@mantine/core';

import { LoginForm } from '@/auth/LoginForm';

export function LoginPage() {
  return (
    <Center h="75vh" mx="auto" px="md" w={400}>
      <LoginForm />
    </Center>
  );
}
