import type { MenuItemType } from 'antd/es/menu/interface';

import {
  FilePdfOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Action, Resource } from '@club-social/shared/roles';
import {
  Button,
  Flex,
  Grid,
  Image,
  Layout,
  Menu,
  Space,
  Spin,
  Typography,
} from 'antd';
import { type PropsWithChildren, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useLocalStorage } from 'react-use';

import { MenuThemeSwitcher } from '@/components/MenuThemeSwitcher';
import { betterAuthClient } from '@/shared/lib/better-auth.client';

import { APP_ROUTES } from './app.enum';

export function AppLayout({ children }: PropsWithChildren) {
  const { sm } = Grid.useBreakpoint();

  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useLocalStorage<boolean>(
    'is-sidebar-collapsed',
    false,
  );

  useEffect(() => {
    const getMenuItems = async () => {
      const items: MenuItemType[] = [
        {
          icon: <HomeOutlined />,
          key: APP_ROUTES.HOME,
          label: 'Inicio',
        },
      ];

      const session = await betterAuthClient.getSession();

      const [
        hasUsersListPermission,
        hasDuesListPermission,
        hasMovementListPermission,
        hasPaymentListPermission,
        hasMemberListPermission,
      ] = await Promise.all([
        betterAuthClient.admin.hasPermission({
          permission: {
            [Resource.USERS]: [Action.LIST],
          },
          userId: session.data?.user.id,
        }),
        betterAuthClient.admin.hasPermission({
          permission: {
            [Resource.DUES]: [Action.LIST],
          },
          userId: session.data?.user.id,
        }),
        betterAuthClient.admin.hasPermission({
          permission: {
            [Resource.MOVEMENTS]: [Action.LIST],
          },
          userId: session.data?.user.id,
        }),
        betterAuthClient.admin.hasPermission({
          permission: {
            [Resource.PAYMENTS]: [Action.LIST],
          },
          userId: session.data?.user.id,
        }),
        betterAuthClient.admin.hasPermission({
          permission: {
            [Resource.MEMBERS]: [Action.LIST],
          },
          userId: session.data?.user.id,
        }),
      ]);

      if (hasDuesListPermission.data?.success) {
        items.push({
          icon: <UserOutlined />,
          key: APP_ROUTES.DUES_LIST,
          label: 'Deudas',
        });
      }

      if (hasMovementListPermission.data?.success) {
        items.push({
          icon: <UserOutlined />,
          key: APP_ROUTES.MOVEMENT_LIST,
          label: 'Movimientos',
        });
      }

      if (hasPaymentListPermission.data?.success) {
        items.push({
          icon: <UserOutlined />,
          key: APP_ROUTES.PAYMENT_LIST,
          label: 'Pagos',
        });
      }

      if (hasMemberListPermission.data?.success) {
        items.push({
          icon: <UserOutlined />,
          key: APP_ROUTES.MEMBER_LIST,
          label: 'Miembros',
        });
      }

      if (hasUsersListPermission.data?.success) {
        items.push({
          icon: <UserOutlined />,
          key: APP_ROUTES.USER_LIST,
          label: 'Usuarios',
        });
      }

      setMenuItems(items);
      setIsMenuLoading(false);
    };

    getMenuItems();
  }, []);

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

          {isMenuLoading && <Spin size="large" />}
          {!isMenuLoading && (
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
          )}

          <Menu
            className="mt-auto border-e-0"
            items={[
              {
                icon: <LogoutOutlined />,
                key: APP_ROUTES.LOGOUT,
                label: 'Cerrar sesión',
              },
            ]}
            mode="inline"
            onClick={({ key }) => {
              navigate(key);
            }}
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
