import type { MenuItemType } from 'antd/es/menu/interface';

import {
  FilePdfOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  ConfigProvider,
  Flex,
  FloatButton,
  Grid,
  Image,
  Layout,
  Menu,
  Space,
  theme,
  Typography,
} from 'antd';
import { type PropsWithChildren, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useLocalStorage } from 'react-use';

import { useUser } from '@/auth/useUser';
import { AddNewIcon } from '@/ui/Icons/AddNewIcon';
import { DashboardIcon } from '@/ui/Icons/DashboardIcon';
import { DuesIcon } from '@/ui/Icons/DuesIcon';
import { LogoutIcon } from '@/ui/Icons/LogoutIcon';
import { MovementsIcon } from '@/ui/Icons/MovementsIcon';
import { PaymentsIcon } from '@/ui/Icons/PaymentsIcon';
import { UsersIcon } from '@/ui/Icons/UsersIcon';
import { MenuThemeSwitcher } from '@/ui/MenuThemeSwitcher';
import { usePermissions } from '@/users/use-permissions';

import { APP_ROUTES } from './app.enum';
import { useAppContext } from './AppContext';

export function AppLayout({ children }: PropsWithChildren) {
  const { sm } = Grid.useBreakpoint();
  const { themeMode } = useAppContext();
  const { token } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useLocalStorage<boolean>(
    'is-sidebar-collapsed',
    true,
  );

  const user = useUser();

  const permissions = usePermissions();

  const menuItems: MenuItemType[] = [
    {
      icon: <DashboardIcon />,
      key: APP_ROUTES.HOME,
      label: 'Inicio',
    },
  ];

  if (permissions.dues.list) {
    menuItems.push({
      icon: <DuesIcon />,
      key: APP_ROUTES.DUES_LIST,
      label: 'Deudas',
    });
  }

  if (permissions.payments.list) {
    menuItems.push({
      icon: <PaymentsIcon />,
      key: APP_ROUTES.PAYMENTS,
      label: 'Pagos',
    });
  }

  if (permissions.movements.list) {
    menuItems.push({
      icon: <MovementsIcon />,
      key: APP_ROUTES.MOVEMENTS_LIST,
      label: 'Movimientos',
    });
  }

  if (permissions.members.list) {
    menuItems.push({
      icon: <UsersIcon />,
      key: APP_ROUTES.MEMBERS_LIST,
      label: 'Socios',
    });
  }

  if (permissions.users.list) {
    menuItems.push({
      icon: <UsersIcon />,
      key: APP_ROUTES.USERS_LIST,
      label: 'Usuarios',
    });
  }

  const [selectedKeys, setSelectedKeys] = useState<string[]>([
    `/${location.pathname.split('/')[1]}`,
  ]);

  return (
    <Layout className="min-h-screen" hasSider>
      <Layout.Sider
        collapsed={collapsed}
        collapsible
        onCollapse={setCollapsed}
        theme={themeMode}
      >
        <Flex className="h-full" vertical>
          <Image
            alt="Club Social Logo"
            className="mx-auto max-w-[128px]"
            preview={false}
            rootClassName="w-full my-8"
            src="/club-social-logo.png"
          />

          <Space align="center" className="mb-8 px-6" vertical>
            <Avatar className="text-center" size="default">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </Avatar>
            {!collapsed && (
              <Typography.Text>
                Hola {user.firstName} {user.lastName}
              </Typography.Text>
            )}
          </Space>

          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  darkItemBg: token.Layout?.bodyBg,
                  itemBg: token.Layout?.bodyBg,
                },
              },
            }}
          >
            <Menu
              className="border-e-0"
              items={menuItems}
              mode="inline"
              onClick={({ key }) => {
                setSelectedKeys([key]);
                navigate(key);
              }}
              selectedKeys={selectedKeys}
              theme={themeMode}
            />

            <Menu
              className="mt-auto border-e-0"
              items={[
                {
                  icon: <UserOutlined />,
                  key: APP_ROUTES.PROFILE,
                  label: 'Mi Perfil',
                },
                {
                  icon: <LogoutIcon />,
                  key: APP_ROUTES.LOGOUT,
                  label: 'Cerrar sesión',
                },
              ]}
              mode="inline"
              onClick={({ key }) => {
                setSelectedKeys([key]);
                navigate(key);
              }}
              selectedKeys={selectedKeys}
              theme={themeMode}
            />
          </ConfigProvider>
        </Flex>
      </Layout.Sider>

      <Layout>
        <Layout.Content className="p-4">{children}</Layout.Content>

        <Layout.Footer className="p-4">
          <Flex align="center" gap="small" justify="space-between">
            <Space.Compact size="small">
              <Button
                href="https://drive.google.com/file/d/1_rFbEf4z5Rx801ElUYfdk4qrCOv-maj_/view?usp=drive_link"
                icon={<FilePdfOutlined />}
                target="_blank"
                type="text"
              />
            </Space.Compact>
            {sm && <Typography.Text>Hecho por D.</Typography.Text>}

            <div>
              <MenuThemeSwitcher />
            </div>
          </Flex>
        </Layout.Footer>

        <FloatButton.Group icon={<AddNewIcon />} trigger="click" type="primary">
          {permissions.members.create && (
            <Link to={APP_ROUTES.MEMBERS_NEW}>
              <FloatButton
                icon={<UserAddOutlined />}
                tooltip={{ placement: 'left', title: 'Nuevo socio' }}
              />
            </Link>
          )}

          {permissions.dues.create && (
            <Link to={APP_ROUTES.DUES_NEW}>
              <FloatButton
                icon={<DuesIcon />}
                tooltip={{ placement: 'left', title: 'Nueva deuda' }}
              />
            </Link>
          )}

          {permissions.payments.create && (
            <Link to={APP_ROUTES.PAYMENTS_NEW}>
              <FloatButton
                icon={<PaymentsIcon />}
                tooltip={{ placement: 'left', title: 'Nuevo pago' }}
              />
            </Link>
          )}
        </FloatButton.Group>
      </Layout>
    </Layout>
  );
}
