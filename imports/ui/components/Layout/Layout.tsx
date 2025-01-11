import {
  CopyrightCircleOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  HeartOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';
import {
  Layout as AntLayout,
  Col,
  Flex,
  FloatButton,
  Image,
  Menu,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { LocalStorageUtils } from '@shared/utils/localStorage.utils';
import { AppUrl, AppUrlGenericEnum } from '@ui/app.enum';
import { Button } from '@ui/components/Button/Button';
import { AddNewIcon } from '@ui/components/Icons/AddNewIcon';
import { DashboardIcon } from '@ui/components/Icons/DashboardIcon';
import { DuesIcon } from '@ui/components/Icons/DuesIcon';
import { EventsIcon } from '@ui/components/Icons/EventsIcon';
import { LogoutIcon } from '@ui/components/Icons/LogoutIcon';
import { MovementsIcon } from '@ui/components/Icons/MovementsIcon';
import { PaymentsIcon } from '@ui/components/Icons/PaymentsIcon';
import { PricesIcon } from '@ui/components/Icons/PricesIcon';
import { UsersIcon } from '@ui/components/Icons/UsersIcon';
import { Row } from '@ui/components/Layout/Row';
import { ThemeSelector } from '@ui/components/Layout/ThemeSelector';
import { useLoggedInUser } from '@ui/hooks/auth/useLoggedInUser';
import { usePermissions } from '@ui/hooks/auth/usePermissions';
import { useThemeContext } from '@ui/providers/ThemeContext';

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const user = useLoggedInUser();

  const permissions = usePermissions();

  const navigate = useNavigate();

  const { theme } = useThemeContext();

  const location = useLocation();

  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(
    LocalStorageUtils.get('isMenuCollapsed') ?? false,
  );

  const pathnameKey = `${location.pathname.split('/')[1]}` || AppUrl.HOME;

  const [selectedMenuItemKey, setSelectedMenuItemKey] =
    useState<string>(pathnameKey);

  useEffect(() => {
    setSelectedMenuItemKey(pathnameKey);
  }, [pathnameKey]);

  useEffect(() => {
    LocalStorageUtils.set('isMenuCollapsed', isMenuCollapsed);
  }, [isMenuCollapsed]);

  const getMenuItems = (): ItemType[] => {
    const items: ItemType[] = [];

    items.push({
      icon: <DashboardIcon />,
      key: AppUrl.HOME,
      label: (
        <Link className="no-underline" to={AppUrl.HOME}>
          Inicio
        </Link>
      ),
    });

    if (permissions.users.read) {
      items.push({
        icon: <UsersIcon />,
        key: AppUrl.USERS,
        label: (
          <Link className="no-underline" to={AppUrl.USERS}>
            Usuarios
          </Link>
        ),
      });
    }

    if (permissions.member.read) {
      items.push({
        icon: <UsersIcon />,
        key: AppUrl.MEMBERS,
        label: (
          <Link className="no-underline" to={AppUrl.MEMBERS}>
            Socios
          </Link>
        ),
      });
    }

    if (permissions.dues.read) {
      items.push({
        icon: <DuesIcon />,
        key: AppUrl.DUES,
        label: (
          <Link className="no-underline" to={AppUrl.DUES}>
            Deudas
          </Link>
        ),
      });
    }

    if (permissions.payments.read) {
      items.push({
        icon: <PaymentsIcon />,
        key: AppUrl.PAYMENTS,
        label: (
          <Link className="no-underline" to={AppUrl.PAYMENTS}>
            Pagos
          </Link>
        ),
      });
    }

    if (permissions.movements.read) {
      items.push({
        icon: <MovementsIcon />,
        key: AppUrl.MOVEMENTS,
        label: (
          <Link className="no-underline" to={AppUrl.MOVEMENTS}>
            Movimientos
          </Link>
        ),
      });
    }

    if (permissions.prices.read) {
      items.push({
        icon: <PricesIcon />,
        key: AppUrl.PRICES,
        label: (
          <Link className="no-underline" to={AppUrl.PRICES}>
            Precios
          </Link>
        ),
      });
    }

    if (permissions.events.read) {
      items.push({
        icon: <EventsIcon />,
        key: AppUrl.EVENTS,
        label: (
          <Link className="no-underline" to={AppUrl.EVENTS}>
            Eventos
          </Link>
        ),
      });
    }

    return items;
  };

  const userName = `${user.profile?.firstName} ${user.profile?.lastName}`;

  return (
    <AntLayout hasSider className="flex min-h-screen flex-col">
      <AntLayout.Sider
        collapsed={isMenuCollapsed}
        onCollapse={setIsMenuCollapsed}
        collapsible
        className="cs-sider"
        width={220}
        theme={theme}
      >
        <Image
          wrapperClassName="my-8 ml-[.475rem]"
          className="mx-auto max-w-[128px]"
          preview={false}
          src="/images/logo.png"
          alt="Rixsus Logo"
        />

        {!isMenuCollapsed && (
          <div className="mb-12 px-8">
            <Row align="middle" wrap={false}>
              <Col flex={1} className="pl-4">
                <Typography.Text className="block text-base font-light">
                  Hola,
                </Typography.Text>

                <Typography.Text className="block text-base font-medium">
                  {userName}
                </Typography.Text>
              </Col>
            </Row>
          </div>
        )}

        <Menu
          className="cs-menu"
          mode="inline"
          selectedKeys={[selectedMenuItemKey]}
          items={getMenuItems()}
        />

        <Menu
          className="cs-menu mt-auto"
          mode="inline"
          items={[
            {
              icon: <LogoutIcon />,
              key: `${AppUrl.AUTH}/${AppUrl.AUTH_LOGOUT}`,
              label: (
                <Link
                  className="no-underline"
                  to={`${AppUrl.AUTH}/${AppUrl.AUTH_LOGOUT}`}
                >
                  Cerrar sesión
                </Link>
              ),
            },
          ]}
        />
      </AntLayout.Sider>

      <AntLayout className="relative max-w-screen-2xl px-4 pb-4 pt-10 lg:px-10">
        <AntLayout.Content className="">{children}</AntLayout.Content>

        <AntLayout.Footer className="p-0">
          <Flex align="center" wrap justify="space-between">
            <Space.Compact>
              <Button
                tooltip={{ title: 'Reglamento' }}
                icon={<FilePdfOutlined />}
                htmlType="button"
                type="text"
                href="https://drive.google.com/file/d/1_rFbEf4z5Rx801ElUYfdk4qrCOv-maj_/view?usp=drive_link"
                target="_blank"
              />
              <Button
                tooltip={{ title: 'Formulario de Registro' }}
                icon={<FileTextOutlined />}
                htmlType="button"
                type="text"
                href="https://docs.google.com/forms/d/e/1FAIpQLSdMysEOdliOL3Aug58ns2W3oz8vv2Q6kwJSzsbOKc_rdtqIXA/viewform?usp=header"
                target="_blank"
              />
              <Button
                tooltip={{ title: 'Enviar WhatsApp al Club' }}
                icon={<WhatsAppOutlined />}
                htmlType="button"
                type="text"
                href="https://wa.me/5491158804950"
                target="_blank"
              />
            </Space.Compact>

            <Tooltip
              title={
                <>
                  Hecho con <HeartOutlined /> por D.
                </>
              }
            >
              <CopyrightCircleOutlined />
            </Tooltip>

            <ThemeSelector />
          </Flex>
        </AntLayout.Footer>

        {(permissions.isAdmin || permissions.isStaff) && (
          <FloatButton.Group
            className="absolute right-4 lg:right-10"
            shape="square"
            trigger="hover"
            type="primary"
            style={{ bottom: 75 }}
            icon={<AddNewIcon />}
          >
            {permissions.movements.create && (
              <FloatButton
                tooltip="Nuevo movimiento"
                icon={<MovementsIcon />}
                onClick={() =>
                  navigate(`${AppUrl.MOVEMENTS}/${AppUrlGenericEnum.NEW}`)
                }
              />
            )}

            {permissions.dues.create && (
              <FloatButton
                tooltip="Nueva deuda"
                icon={<DuesIcon />}
                onClick={() =>
                  navigate(`${AppUrl.DUES}/${AppUrlGenericEnum.NEW}`)
                }
              />
            )}

            {permissions.payments.create && (
              <FloatButton
                tooltip="Nuevo pago"
                icon={<PaymentsIcon />}
                onClick={() =>
                  navigate(`${AppUrl.PAYMENTS}/${AppUrlGenericEnum.NEW}`)
                }
              />
            )}
          </FloatButton.Group>
        )}
      </AntLayout>
    </AntLayout>
  );
};
