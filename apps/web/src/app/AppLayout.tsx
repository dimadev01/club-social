import type { PropsWithChildren } from 'react';

import {
  ActionIcon,
  AppShell,
  Burger,
  Container,
  Group,
  Image,
  NavLink,
  ScrollArea,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBrandInstagram,
  IconLogout2,
  IconMoon,
  IconSun,
  IconSunMoon,
} from '@tabler/icons-react';
import { NavLink as ReactRouterNavLink } from 'react-router';

import { useAppContext } from '@/app/app.context';

import { APP_ROUTES } from '../app/app.enum';
import { AppMenu } from './AppMenu';

export function AppLayout({ children }: PropsWithChildren) {
  const { session } = useAppContext();
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  if (!session) {
    throw new Error('Session not found');
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
          <div id="breadcrumbs" />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <AppShell.Section py="md">
          <Image h={96} mx="auto" src="/club-social-logo.png" w={96} />
        </AppShell.Section>

        <AppShell.Section p="lg">
          <Text>Hola</Text>
          <Text fw="bold" lineClamp={1}>
            {session.user.email ?? ''}
          </Text>
        </AppShell.Section>

        <AppShell.Section component={ScrollArea} grow>
          <AppMenu />
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
        <Container>{children}</Container>
      </AppShell.Main>

      <AppShell.Footer p="md" withBorder={false}>
        <Group justify="space-between">
          <ActionIcon.Group>
            <ActionIcon variant="transparent">
              <IconBrandInstagram />
            </ActionIcon>
            <ActionIcon variant="transparent">
              <IconBrandInstagram />
            </ActionIcon>
            <ActionIcon variant="transparent">
              <IconBrandInstagram />
            </ActionIcon>
          </ActionIcon.Group>
          <Group>
            <ActionIcon.Group>
              <ActionIcon
                onClick={() => setColorScheme('light')}
                variant={colorScheme === 'light' ? 'filled' : 'default'}
              >
                <IconSun />
              </ActionIcon>
              <ActionIcon
                onClick={() => setColorScheme('dark')}
                variant={colorScheme === 'dark' ? 'filled' : 'default'}
              >
                <IconMoon />
              </ActionIcon>
              <ActionIcon
                onClick={() => setColorScheme('auto')}
                variant={colorScheme === 'auto' ? 'filled' : 'default'}
              >
                <IconSunMoon />
              </ActionIcon>
            </ActionIcon.Group>
          </Group>
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
}
