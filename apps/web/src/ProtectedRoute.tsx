import { AppShell, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Navigate, Outlet } from 'react-router';

import { APP_ROUTES } from './app.enum';
import { useAppContext } from './context/app.context';

export function ProtectedRoute() {
  const { session } = useAppContext();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  if (!session) {
    return <Navigate to={APP_ROUTES.LOGIN} />;
  }

  return (
    <AppShell
      header={{ height: 60 }}
      layout="alt"
      navbar={{
        breakpoint: 'sm',
        collapsed: {
          desktop: !desktopOpened,
          mobile: !mobileOpened,
        },
        width: 300,
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            hiddenFrom="sm"
            onClick={toggleMobile}
            opened={mobileOpened}
            size="sm"
          />
          <Burger
            onClick={toggleDesktop}
            opened={desktopOpened}
            size="sm"
            visibleFrom="sm"
          />
          The burger icon is always visible
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        You can collapse the Navbar both on desktop and mobile. After sm
        breakpoint, the navbar is no longer offset by padding in the main
        element and it takes the full width of the screen when opened.
      </AppShell.Navbar>
      <AppShell.Main>
        <Text>This is the main section, your app content here.</Text>
        <Text>The navbar is collapsible both on mobile and desktop. Nice!</Text>
        <Text>Mobile and desktop opened state can be managed separately.</Text>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
