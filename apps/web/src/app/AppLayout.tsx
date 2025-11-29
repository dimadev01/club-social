import type { PropsWithChildren } from 'react';

import {
  ActionIcon,
  AppShell,
  Burger,
  Container,
  Divider,
  Group,
  Image,
  NavLink,
  ScrollArea,
  Stack,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBrandInstagram,
  IconHome,
  IconLogout2,
  IconMoon,
  IconSun,
  IconUsers,
} from '@tabler/icons-react';
import { Navigate, NavLink as ReactRouterNavLink } from 'react-router';

import { useAppContext } from '@/app/app.context';

import { APP_ROUTES } from '../app/app.enum';

export function AppLayout({ children }: PropsWithChildren) {
  const { session } = useAppContext();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  if (!session) {
    return <Navigate to={APP_ROUTES.LOGIN} />;
  }

  return (
    <AppShell
      footer={{ height: 60 }}
      header={{ height: 60 }}
      layout="alt"
      navbar={{
        breakpoint: 'sm',
        collapsed: {
          desktop: !desktopOpened,
          mobile: !mobileOpened,
        },
        width: 220,
      }}
      padding="md"
    >
      <AppShell.Header p="md">
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
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <AppShell.Section py="md">
          <Image h={96} mx="auto" src="/club-social-logo.png" w={96} />
        </AppShell.Section>

        <Divider />

        <AppShell.Section component={ScrollArea} grow>
          <NavLink
            component={ReactRouterNavLink}
            h={48}
            label="Inicio"
            leftSection={<IconHome />}
            pl="lg"
            to={APP_ROUTES.HOME}
          />
          <NavLink
            component={ReactRouterNavLink}
            h={48}
            label="Socios"
            leftSection={<IconUsers />}
            pl="lg"
            to={APP_ROUTES.MEMBERS}
          />
        </AppShell.Section>
        <AppShell.Section>
          <NavLink
            component={ReactRouterNavLink}
            h={48}
            label="Cerrar sesión"
            leftSection={<IconLogout2 />}
            pl="lg"
            to={APP_ROUTES.LOGOUT}
          />
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container>
          <Stack justify="space-between">{children}</Stack>
        </Container>
      </AppShell.Main>

      <AppShell.Footer p="md" withBorder={false}>
        <Group justify="space-between">
          <ActionIcon.Group>
            <ActionIcon color="black" variant="transparent">
              <IconBrandInstagram />
            </ActionIcon>
            <ActionIcon color="black" variant="transparent">
              <IconBrandInstagram />
            </ActionIcon>
            <ActionIcon color="black" variant="transparent">
              <IconBrandInstagram />
            </ActionIcon>
          </ActionIcon.Group>
          <Group>
            <ActionIcon onClick={toggleColorScheme} variant="default">
              {colorScheme === 'dark' ? <IconSun /> : <IconMoon />}
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
}
