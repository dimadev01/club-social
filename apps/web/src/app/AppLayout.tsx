import type { MenuItemType } from 'antd/es/menu/interface';

import {
  FilePdfOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Flex,
  Grid,
  Image,
  Layout,
  Menu,
  Space,
  Typography,
} from 'antd';
import { type PropsWithChildren, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useLocalStorage } from 'react-use';

import { useUser } from '@/auth/useUser';
import { MenuThemeSwitcher } from '@/components/MenuThemeSwitcher';
import { usePermissions } from '@/users/use-permissions';

import { APP_ROUTES } from './app.enum';

export function AppLayout({ children }: PropsWithChildren) {
  const { sm } = Grid.useBreakpoint();

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
      icon: <HomeOutlined />,
      key: APP_ROUTES.HOME,
      label: 'Inicio',
    },
  ];

  if (permissions.dues) {
    menuItems.push({
      icon: <UserOutlined />,
      key: APP_ROUTES.DUES_LIST,
      label: 'Deudas',
    });
  }

  if (permissions.movements) {
    menuItems.push({
      icon: <UserOutlined />,
      key: APP_ROUTES.MOVEMENT_LIST,
      label: 'Movimientos',
    });
  }

  if (permissions.payments) {
    menuItems.push({
      icon: <UserOutlined />,
      key: APP_ROUTES.PAYMENT_LIST,
      label: 'Pagos',
    });
  }

  if (permissions.members) {
    menuItems.push({
      icon: <UserOutlined />,
      key: APP_ROUTES.MEMBER_LIST,
      label: 'Miembros',
    });
  }

  if (permissions.users.list) {
    menuItems.push({
      icon: <UserOutlined />,
      key: APP_ROUTES.USER_LIST,
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
        theme="light"
        zeroWidthTriggerStyle={{ top: 8 }}
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

          <Menu
            className="border-e-0"
            items={menuItems}
            mode="inline"
            onClick={({ key }) => {
              setSelectedKeys([key]);
              navigate(key);
            }}
            selectedKeys={selectedKeys}
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
                icon: <LogoutOutlined />,
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
          />
        </Flex>
      </Layout.Sider>

      <Layout>
        <Layout.Content>{children}</Layout.Content>

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
      </Layout>
    </Layout>
  );
}
