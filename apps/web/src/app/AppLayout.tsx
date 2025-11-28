import type { PropsWithChildren } from 'react';

import {
  AppShell,
  Burger,
  Container,
  Group,
  Image,
  NavLink,
  Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHome, IconLogout2, IconUsers } from '@tabler/icons-react';
import { Navigate, NavLink as ReactRouterNavLink } from 'react-router';

import { useAppContext } from '@/app/app.context';

import { APP_ROUTES } from '../app/app.enum';

export function AppLayout({ children }: PropsWithChildren) {
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
      <AppShell.Header px="md">
        <Group h="100%">
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

      <AppShell.Navbar py="md">
        <Stack flex={1} justify="space-between">
          <Stack>
            <Image h={128} mx="auto" src="/club-social-logo.png" w={128} />
            <Stack gap={0}>
              <NavLink
                component={ReactRouterNavLink}
                h={48}
                label="Inicio"
                leftSection={<IconHome size={16} />}
                pl="lg"
                to={APP_ROUTES.HOME}
              />
              <NavLink
                component={ReactRouterNavLink}
                h={48}
                label="Socios"
                leftSection={<IconUsers size={16} />}
                pl="lg"
                to={APP_ROUTES.MEMBERS}
              />
            </Stack>
          </Stack>
          <Stack>
            <NavLink
              component={ReactRouterNavLink}
              h={48}
              label="Cerrar sesión"
              leftSection={<IconLogout2 size={16} />}
              pl="lg"
              to={APP_ROUTES.LOGOUT}
            />
          </Stack>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container>{children}</Container>
      </AppShell.Main>
    </AppShell>
  );
}
