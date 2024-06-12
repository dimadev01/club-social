import {
  CreditCardOutlined,
  FilePdfOutlined,
  LineChartOutlined,
  LogoutOutlined,
  MailOutlined,
  NotificationOutlined,
  SwapOutlined,
  TeamOutlined,
  WalletOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';
import {
  Layout as AntLayout,
  Col,
  Flex,
  Image,
  Menu,
  Space,
  Typography,
} from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { LocalStorageUtils } from '@shared/utils/localStorage.utils';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button/Button';
import { Row } from '@ui/components/Layout/Row';
import { ThemeSelect } from '@ui/components/Layout/ThemeSelect';
import { useIsAdmin } from '@ui/hooks/auth/useIsAdmin';
import { useIsInRole } from '@ui/hooks/auth/useIsInRole';
import { useIsStaff } from '@ui/hooks/auth/useIsStaff';
import { useLoggedInUser } from '@ui/hooks/auth/useLoggedInUser';
import { useThemeContext } from '@ui/providers/ThemeContext';

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const user = useLoggedInUser();

  const isAdmin = useIsAdmin();

  const isStaff = useIsStaff();

  const canReadMembers = useIsInRole(PermissionEnum.READ, ScopeEnum.MEMBERS);

  const canReadDues = useIsInRole(PermissionEnum.READ, ScopeEnum.DUES);

  const canReadPayments = useIsInRole(PermissionEnum.READ, ScopeEnum.PAYMENTS);

  const canReadMovements = useIsInRole(
    PermissionEnum.READ,
    ScopeEnum.MOVEMENTS,
  );

  const { theme } = useThemeContext();

  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(
    LocalStorageUtils.get('isMenuCollapsed') ?? false,
  );

  useEffect(() => {
    LocalStorageUtils.set('isMenuCollapsed', isMenuCollapsed);
  }, [isMenuCollapsed]);

  const pathnameKey = `/${window.location.pathname.split('/')[1]}`;

  const getMenuItems = (): ItemType[] => {
    const items: ItemType[] = [];

    if (isAdmin || isStaff) {
      items.push({
        icon: <LineChartOutlined className="!text-lg" />,
        key: AppUrl.Home,
        label: (
          <Link className="no-underline" to={AppUrl.Home}>
            Inicio
          </Link>
        ),
      });
    }

    if (canReadMembers) {
      items.push({
        icon: <TeamOutlined className="!text-lg" />,
        key: AppUrl.MEMBERS,
        label: (
          <Link className="no-underline" to={AppUrl.MEMBERS}>
            Socios
          </Link>
        ),
      });
    }

    if (canReadDues) {
      items.push({
        icon: <WalletOutlined className="!text-lg" />,
        key: AppUrl.DUES,
        label: (
          <Link className="no-underline" to={AppUrl.DUES}>
            Deudas
          </Link>
        ),
      });
    }

    if (canReadPayments) {
      items.push({
        icon: <CreditCardOutlined className="!text-lg" />,
        key: AppUrl.PAYMENTS,
        label: (
          <Link className="no-underline" to={AppUrl.PAYMENTS}>
            Pagos
          </Link>
        ),
      });
    }

    if (canReadMovements) {
      items.push({
        icon: <SwapOutlined className="!text-lg" />,
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

  const userName = `${user.profile?.firstName} ${user.profile?.lastName}`;

  return (
    <AntLayout hasSider className="flex min-h-screen flex-col">
      <AntLayout.Sider
        collapsed={isMenuCollapsed}
        onCollapse={setIsMenuCollapsed}
        collapsible
        className="cs-sider"
        width={200}
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
          defaultSelectedKeys={[pathnameKey]}
          items={getMenuItems()}
        />

        <Menu
          className="cs-menu mt-auto"
          mode="inline"
          items={[
            {
              icon: <LogoutOutlined className="!text-lg" />,
              key: 'logout',
              label: (
                <Link className="no-underline" to={AppUrl.LOGOUT}>
                  Cerrar sesión
                </Link>
              ),
            },
          ]}
        />
      </AntLayout.Sider>

      <AntLayout className="cs-layout-content">
        <AntLayout.Content className="px-4 py-8 sm:p-14 ">
          {children}
        </AntLayout.Content>

        <AntLayout.Footer>
          <Flex justify="space-between">
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

            <Space>
              <ThemeSelect />

              <Space.Compact>
                <Button
                  tooltip={{ title: 'Enviar Email' }}
                  icon={<MailOutlined />}
                  htmlType="button"
                  type="text"
                  href="mailto:info@clubsocialmontegrande.ar"
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
    </AntLayout>
  );
};
