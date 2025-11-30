import { NavLink } from '@mantine/core';
import { IconHome, IconUsers } from '@tabler/icons-react';
import { NavLink as ReactRouterNavLink } from 'react-router';

import { APP_ROUTES, type AppRoutes } from './app.enum';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  route: AppRoutes[keyof AppRoutes];
}

const menuItems: MenuItem[] = [
  {
    icon: <IconHome />,
    label: 'Inicio',
    route: APP_ROUTES.HOME,
  },
  {
    icon: <IconUsers />,
    label: 'Usuarios',
    route: APP_ROUTES.USER_LIST,
  },
];

export function AppMenu() {
  return (
    <>
      {menuItems.map((item) => (
        <NavLink
          component={ReactRouterNavLink}
          h={48}
          label={item.label}
          leftSection={item.icon}
          pl="lg"
          to={item.route}
        />
      ))}
    </>
  );
}
