import { HomeOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Flex, Image, Layout, Menu } from 'antd';
import { type PropsWithChildren, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useLocalStorage } from 'react-use';

import { useAppContext } from '@/app/app.context';

import { APP_ROUTES } from './app.enum';

export function AppLayout({ children }: PropsWithChildren) {
  const { session } = useAppContext();
  const [collapsed, setCollapsed] = useLocalStorage(
    'is-sidebar-collapsed',
    false,
  );
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedKeys, setSelectedKeys] = useState<string[]>([
    `/${location.pathname.split('/')[1]}`,
  ]);

  if (!session) {
    throw new Error('Session not found');
  }

  return (
    <Layout className="min-h-screen">
      <Layout.Sider
        className="sticky start-0 top-0 bottom-0 h-screen overflow-auto"
        collapsed={collapsed}
        collapsible
        onCollapse={setCollapsed}
        style={{
          scrollbarGutter: 'stable',
          scrollbarWidth: 'thin',
        }}
        theme="light"
      >
        <Flex className="h-full" vertical>
          <Image
            alt="Club Social Logo"
            className="mx-auto max-w-[128px]"
            preview={false}
            rootClassName="w-full my-8"
            src="/club-social-logo.png"
          />

          <Menu
            className="border-e-0"
            items={[
              {
                icon: <HomeOutlined />,
                key: APP_ROUTES.HOME,
                label: 'Inicio',
              },
              {
                icon: <UserOutlined />,
                key: APP_ROUTES.USER_LIST,
                label: 'Usuarios',
              },
            ]}
            mode="inline"
            onSelect={({ key }) => {
              setSelectedKeys([key]);
              navigate(key);
            }}
            selectedKeys={selectedKeys}
          />

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
            onSelect={({ key }) => {
              navigate(key);
            }}
          />
        </Flex>
      </Layout.Sider>

      <Layout>
        <Layout.Content>{children}</Layout.Content>
        <Layout.Footer style={{ textAlign: 'center' }}>
          Club Social Monte Grande ©{new Date().getFullYear()}
        </Layout.Footer>
      </Layout>
    </Layout>
  );
}
