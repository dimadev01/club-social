import {
  FilePdfOutlined,
  HomeOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
  SyncOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Dropdown,
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

import {
  APP_THEME_MODE,
  type AppThemeMode,
  useAppContext,
} from '@/app/app.context';
import { useSupabaseSession } from '@/auth/useSupabaseSession';

import { APP_ROUTES } from './app.enum';
import { AppLoading } from './AppLoading';

const THEME_ICONS: Record<AppThemeMode, React.ReactNode> = {
  [APP_THEME_MODE.AUTO]: <SyncOutlined />,
  [APP_THEME_MODE.DARK]: <MoonOutlined />,
  [APP_THEME_MODE.LIGHT]: <SunOutlined />,
} as const;

export function AppLayout({ children }: PropsWithChildren) {
  const { isLoading } = useSupabaseSession();
  const { setThemeMode, themeMode } = useAppContext();

  const { sm } = Grid.useBreakpoint();

  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useLocalStorage<boolean>(
    'is-sidebar-collapsed',
    false,
  );

  const [selectedKeys, setSelectedKeys] = useState<string[]>([
    `/${location.pathname.split('/')[1]}`,
  ]);

  if (isLoading) {
    return <AppLoading />;
  }

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
              <Dropdown
                menu={{
                  items: [
                    {
                      icon: <SunOutlined />,
                      key: APP_THEME_MODE.LIGHT,
                      label: 'Claro',
                    },
                    {
                      icon: <MoonOutlined />,
                      key: APP_THEME_MODE.DARK,
                      label: 'Oscuro',
                    },
                    {
                      icon: <SyncOutlined />,
                      key: APP_THEME_MODE.AUTO,
                      label: 'Automático',
                    },
                  ],
                  onClick: ({ key }) => {
                    setThemeMode(key as AppThemeMode);
                  },
                }}
              >
                <Button
                  icon={THEME_ICONS[themeMode]}
                  size="small"
                  type="text"
                />
              </Dropdown>
            </div>
          </Flex>
        </Layout.Footer>
      </Layout>
    </Layout>
  );
}
