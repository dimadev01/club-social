import type { ItemType } from 'antd/es/menu/interface';

import {
  BarChartOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  MenuOutlined,
  NotificationOutlined,
  SettingOutlined,
  TeamOutlined,
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
import { GrGroup } from 'react-icons/gr';
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
  const isMobile = sm === false;
  const isMobileOrLoading = sm !== true;

  const { selectedTheme } = useAppContext();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const [isFloatMenuOpen, setIsFloatMenuOpen] = useState(false);

  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useLocalStorage<boolean>(
    'is-sidebar-collapsed',
    false,
  );

  const isCollapsed = isMobile ? !mobileOpen : desktopCollapsed !== false;

  const user = useSessionUser();
  const isAdmin = user.role === UserRole.ADMIN;
  const isStaff = user.role === UserRole.STAFF;

  const permissions = usePermissions();

  const menuItems = useMemo(() => {
    const items: ItemType[] = [
      {
        icon: <DashboardIcon />,
        key: appRoutes.home,
        label: 'Inicio',
      },
    ];

    if (isAdmin || isStaff) {
      items.push({
        children: [
          {
            icon: <PaymentsIcon />,
            key: appRoutes.statistics.finance,
            label: 'Finanzas',
          },
          {
            icon: <TeamOutlined />,
            key: appRoutes.statistics.members,
            label: 'Socios',
          },
        ],
        icon: <BarChartOutlined />,
        key: '/statistics',
        label: 'Estadísticas',
      });
    }

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

    if (permissions.groups.list) {
      items.push({
        icon: <GrGroup />,
        key: appRoutes.groups.list,
        label: 'Grupos',
      });
    }

    if (permissions.auditLogs.list) {
      items.push({
        icon: <AuditLogsIcon />,
        key: appRoutes.auditLogs.list,
        label: 'Auditoría',
      });
    }

    if (isAdmin) {
      items.push({
        icon: <NotificationOutlined />,
        key: appRoutes.notifications.list,
        label: 'Notificaciones',
      });
    }

    if (isAdmin || isStaff) {
      items.push({
        icon: <SettingOutlined />,
        key: appRoutes.appSettings,
        label: 'Configuración',
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

  const topLevelPath = `/${location.pathname.split('/')[1] ?? ''}`;
  const selectedKeys = [location.pathname, topLevelPath];
  const defaultOpenKeys = isCollapsed ? [] : [topLevelPath];

  return (
    <Layout className="min-h-screen" hasSider={!isMobile}>
      <Layout.Sider
        className={cn(
          'overflow-auto [scrollbar-gutter:stable] [scrollbar-width:thin]',
          isMobile
            ? 'fixed inset-y-0 left-0 z-50 min-h-screen'
            : 'min-h-screen',
        )}
        collapsed={isCollapsed}
        collapsedWidth={isMobileOrLoading ? 0 : 80}
        collapsible={!isMobile}
        onCollapse={setDesktopCollapsed}
        theme={selectedTheme}
        trigger={isMobile ? null : undefined}
        zeroWidthTriggerStyle={{ position: 'fixed', top: 0 }}
      >
        <Flex className="h-full" vertical>
          {!isMobile && (
            <Image
              alt="Club Social Logo"
              className="mx-auto max-w-[128px]"
              fetchPriority="high"
              preview={false}
              rootClassName="w-full mb-6 mt-4"
              src="/club-social-logo.png"
            />
          )}

          <Space
            align="center"
            className={cn('mx-auto mb-6 flex px-4', isMobile ? 'mt-4' : '')}
            size={isCollapsed ? 0 : undefined}
          >
            <Avatar className="text-center" size="default">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </Avatar>
            {!isCollapsed && (
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
              inherit: true,
            }}
          >
            <Menu
              className="border-e-0"
              defaultOpenKeys={defaultOpenKeys}
              items={menuItems}
              mode="inline"
              onClick={({ key }) => {
                navigate(key);
                if (isMobile) setMobileOpen(false);
              }}
              selectedKeys={selectedKeys}
              theme={selectedTheme}
            />
          </ConfigProvider>
        </Flex>
      </Layout.Sider>

      <Layout>
        {isMobile && (
          <>
            <div
              className={cn(
                'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300',
                isCollapsed ? 'pointer-events-none opacity-0' : 'opacity-100',
              )}
              onClick={() => setMobileOpen(false)}
            />
            <Layout.Header
              className="flex items-center gap-3 px-4"
              style={{
                background: token.colorBgContainer,
                height: 52,
                lineHeight: '52px',
                padding: '0 16px',
              }}
            >
              <Button
                icon={<MenuOutlined />}
                onClick={() => setMobileOpen(!mobileOpen)}
                type="text"
              />
              <Image
                alt="Club Social Logo"
                preview={false}
                src="/club-social-logo.png"
                style={{ height: 36, width: 'auto' }}
              />
            </Layout.Header>
          </>
        )}

        <Layout.Content className="p-4 lg:p-6">{children}</Layout.Content>

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
          trigger="hover"
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
