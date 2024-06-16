import {
  FilePdfOutlined,
  HeartOutlined,
  MailOutlined,
  NotificationOutlined,
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
  Typography,
} from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { EmailServiceEnum } from '@application/notifications/emails/email.enum';
import { LocalStorageUtils } from '@shared/utils/localStorage.utils';
import { AppUrl, AppUrlGenericEnum } from '@ui/app.enum';
import { Button } from '@ui/components/Button/Button';
import { AddNewIcon } from '@ui/components/Icons/AddNewIcon';
import { DashboardIcon } from '@ui/components/Icons/DashboardIcon';
import { DuesIcon } from '@ui/components/Icons/DuesIcon';
import { LogoutIcon } from '@ui/components/Icons/LogoutIcon';
import { MovementsIcon } from '@ui/components/Icons/MovementsIcon';
import { PaymentsIcon } from '@ui/components/Icons/PaymentsIcon';
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

    return items;
  };

  const renderFloatButton = () => {
    if (permissions.isMember) {
      return null;
    }

    return (
      <FloatButton.Group
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
            onClick={() => navigate(`${AppUrl.DUES}/${AppUrlGenericEnum.NEW}`)}
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
    );
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

      <AntLayout className="cs-layout-content">
        <AntLayout.Content className="max-w-screen-2xl px-4 py-12 lg:p-10">
          {children}
        </AntLayout.Content>

        <AntLayout.Footer className="px-4 py-2 lg:px-10">
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
                tooltip={{ title: 'Comunicados' }}
                icon={<NotificationOutlined />}
                htmlType="button"
                type="text"
                href="https://drive.google.com/drive/folders/1GOvB0buIDLSpj_WofhsfASH8t8E_eMvi?usp=sharing"
                target="_blank"
              />
            </Space.Compact>

            <Typography.Text className="text-xs">
              Hecho con <HeartOutlined /> por D.
            </Typography.Text>

            <Space>
              <Space.Compact>
                <ThemeSelector />
                <Button
                  tooltip={{ title: 'Enviar Email' }}
                  icon={<MailOutlined />}
                  htmlType="button"
                  type="text"
                  href={`mailto:${EmailServiceEnum.EMAIL_FROM_ADDRESS}`}
                  target="_blank"
                />

                <Button
                  tooltip={{ title: 'Enviar WhatsApp' }}
                  icon={<WhatsAppOutlined />}
                  htmlType="button"
                  type="text"
                  href="https://wa.me/5491158804950"
                  target="_blank"
                />
              </Space.Compact>
            </Space>
          </Flex>
        </AntLayout.Footer>
      </AntLayout>

      {renderFloatButton()}
    </AntLayout>
  );
};
