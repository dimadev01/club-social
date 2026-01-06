import type { MenuItemType } from 'antd/es/menu/interface';

import {
  FilePdfOutlined,
  FileTextOutlined,
  SettingOutlined,
  UserAddOutlined,
  UserOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';
import { UserRole } from '@club-social/shared/users';
import {
  Avatar,
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
import { type PropsWithChildren, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useLocalStorage } from 'react-use';

import { useSessionUser } from '@/auth/useUser';
import { cn } from '@/shared/lib/utils';
import {
  AddNewIcon,
  AuditLogsIcon,
  Button,
  DashboardIcon,
  DuesIcon,
  LedgerIcon,
  LogoutIcon,
  MenuThemeSwitcher,
  MovementsIcon,
  PaymentsIcon,
  PricingIcon,
  UsersIcon,
} from '@/ui';
import { usePermissions } from '@/users/use-permissions';

import { appRoutes } from './app.enum';
import { useAppContext } from './AppContext';

export function AppLayout({ children }: PropsWithChildren) {
  const { sm } = Grid.useBreakpoint();
  const { selectedTheme } = useAppContext();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const [isFloatMenuOpen, setIsFloatMenuOpen] = useState(false);

  const location = useLocation();
  const [collapsed, setCollapsed] = useLocalStorage<boolean>(
    'is-sidebar-collapsed',
    true,
  );

  const user = useSessionUser();
  const isAdmin = user.role === UserRole.ADMIN;
  const isStaff = user.role === UserRole.STAFF;

  const permissions = usePermissions();

  const menuItems = useMemo(() => {
    const items: MenuItemType[] = [
      {
        icon: <DashboardIcon />,
        key: appRoutes.home,
        label: 'Inicio',
      },
    ];

    if (permissions.dues.list) {
      items.push({
        icon: <DuesIcon />,
        key: appRoutes.dues.list,
        label: 'Deudas',
      });
    }

    if (permissions.payments.list) {
      items.push({
        icon: <PaymentsIcon />,
        key: appRoutes.payments.list,
        label: 'Pagos',
      });
    }

    if (permissions.movements.list) {
      items.push({
        icon: <MovementsIcon />,
        key: appRoutes.movements.list,
        label: 'Movimientos',
      });
    }

    if (permissions.memberLedger.list) {
      items.push({
        icon: <LedgerIcon />,
        key: appRoutes.memberLedger.list,
        label: 'Libro Mayor',
      });
    }

    if (permissions.members.list) {
      items.push({
        icon: <UsersIcon />,
        key: appRoutes.members.list,
        label: 'Socios',
      });
    }

    if (permissions.users.list) {
      items.push({
        icon: <UsersIcon />,
        key: appRoutes.users.list,
        label: 'Usuarios',
      });
    }

    if (permissions.pricing.list) {
      items.push({
        icon: <PricingIcon />,
        key: appRoutes.pricing.list,
        label: 'Precios',
      });
    }

    if (permissions.auditLogs.list) {
      items.push({
        icon: <AuditLogsIcon />,
        key: appRoutes.auditLogs.list,
        label: 'Auditoría',
      });
    }

    if (isAdmin || isStaff) {
      items.push({
        icon: <SettingOutlined />,
        key: appRoutes.appSettings,
        label: 'Configuración del Sistema',
      });
    }

    items.push(
      {
        icon: <UserOutlined />,
        key: appRoutes.profile,
        label: 'Mi Perfil',
      },
      {
        icon: <LogoutIcon />,
        key: appRoutes.auth.logout,
        label: 'Cerrar sesión',
      },
    );

    return items;
  }, [isAdmin, isStaff, permissions]);

  const selectedKeys = [`/${location.pathname.split('/')[1]}`];

  return (
    <Layout className="min-h-screen" hasSider>
      <Layout.Sider
        className="min-h-screen overflow-auto [scrollbar-gutter:stable] [scrollbar-width:thin]"
        collapsed={collapsed}
        collapsible
        onCollapse={setCollapsed}
        theme={selectedTheme}
      >
        <Flex className="h-full" vertical>
          <Image
            alt="Club Social Logo"
            className="mx-auto max-w-[128px]"
            preview={false}
            rootClassName="w-full mb-6 mt-4"
            src="/club-social-logo.png"
          />

          <Space
            align="center"
            className={cn('mx-auto mb-6 flex px-4')}
            size={collapsed ? 0 : undefined}
          >
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
              onClick={({ key }) => navigate(key)}
              selectedKeys={selectedKeys}
              theme={selectedTheme}
            />
          </ConfigProvider>
        </Flex>
      </Layout.Sider>

      <Layout>
        <Layout.Content className="p-4 xl:px-10">{children}</Layout.Content>

        <Layout.Footer className="p-4">
          <Flex align="center" gap="small" justify="space-between">
            <Space.Compact size="small">
              <Button
                href="https://drive.google.com/file/d/1_rFbEf4z5Rx801ElUYfdk4qrCOv-maj_/view?usp=drive_link"
                icon={<FilePdfOutlined />}
                target="_blank"
                tooltip="Manual de Club"
                type="text"
              />
              <Button
                href="https://docs.google.com/forms/d/e/1FAIpQLSdMysEOdliOL3Aug58ns2W3oz8vv2Q6kwJSzsbOKc_rdtqIXA/viewform?usp=header"
                htmlType="button"
                icon={<FileTextOutlined />}
                target="_blank"
                tooltip="Formulario de Registro"
                type="text"
              />
              <Button
                href="https://wa.me/5491158804950"
                htmlType="button"
                icon={<WhatsAppOutlined />}
                target="_blank"
                tooltip="Enviar WhatsApp al Club"
                type="text"
              />
            </Space.Compact>

            {sm && <Typography.Text>Hecho por D.</Typography.Text>}

            <div>
              <MenuThemeSwitcher />
            </div>
          </Flex>
        </Layout.Footer>

        <FloatButton.Group
          icon={<AddNewIcon />}
          onOpenChange={setIsFloatMenuOpen}
          open={isFloatMenuOpen}
          trigger="click"
          type="primary"
        >
          {permissions.members.create && (
            <Link to={appRoutes.members.new}>
              <FloatButton
                icon={<UserAddOutlined />}
                onClick={() => setIsFloatMenuOpen(false)}
                tooltip={{ placement: 'left', title: 'Nuevo socio' }}
              />
            </Link>
          )}

          {permissions.dues.create && (
            <Link to={appRoutes.dues.new}>
              <FloatButton
                icon={<DuesIcon />}
                onClick={() => setIsFloatMenuOpen(false)}
                tooltip={{ placement: 'left', title: 'Nueva deuda' }}
              />
            </Link>
          )}

          {permissions.payments.create && (
            <Link to={appRoutes.payments.new}>
              <FloatButton
                icon={<PaymentsIcon />}
                onClick={() => setIsFloatMenuOpen(false)}
                tooltip={{ placement: 'left', title: 'Nuevo pago' }}
              />
            </Link>
          )}
        </FloatButton.Group>
      </Layout>
    </Layout>
  );
}
