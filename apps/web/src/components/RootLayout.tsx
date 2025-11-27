import { Outlet } from 'react-router';

import { Container } from '@/ui/Container';

export function RootLayout() {
  return (
    <Container h="100vh">
      <Outlet />
    </Container>
  );
}
