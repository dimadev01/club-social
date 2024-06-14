import {
  CreditCardOutlined,
  FilePdfOutlined,
  LineChartOutlined,
  LogoutOutlined,
  MailOutlined,
  NotificationOutlined,
  PlusOutlined,
  SwapOutlined,
  TeamOutlined,
  WalletOutlined,
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
import { Link } from 'react-router-dom';

import { EmailServiceEnum } from '@application/notifications/emails/email-service.enum';
import { LocalStorageUtils } from '@shared/utils/localStorage.utils';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button/Button';
import { Row } from '@ui/components/Layout/Row';
import { ThemeSelector } from '@ui/components/Layout/ThemeSelector';
import { useLoggedInUser } from '@ui/hooks/auth/useLoggedInUser';
import { usePermissions } from '@ui/hooks/auth/usePermissions';
import { useNavigate } from '@ui/hooks/ui/useNavigate';
import { useThemeContext } from '@ui/providers/ThemeContext';

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const user = useLoggedInUser();

  const permissions = usePermissions();

  const navigate = useNavigate();

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

    if (permissions.isAdmin || permissions.isStaff) {
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

    if (permissions.member.read) {
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

    if (permissions.dues.read) {
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

    if (permissions.payments.read) {
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

    if (permissions.movements.read) {
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

  const renderFloatButton = () => {
    if (permissions.isMember) {
      return null;
    }

    return (
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ bottom: 75 }}
        icon={<PlusOutlined />}
      >
        {permissions.movements.create && (
          <FloatButton
            tooltip="Nuevo movimiento"
            icon={<SwapOutlined />}
            onClick={() => navigate(AppUrl.MOVEMENTS_NEW)}
          />
        )}

        {permissions.dues.create && (
          <FloatButton
            tooltip="Nueva deuda"
            icon={<WalletOutlined />}
            onClick={() => navigate(AppUrl.DUES_NEW)}
          />
        )}

        {permissions.payments.create && (
          <FloatButton
            tooltip="Nuevo pago"
            icon={<CreditCardOutlined />}
            onClick={() => navigate(AppUrl.PAYMENTS_NEW)}
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
        <AntLayout.Content className="max-w-screen-xl px-4 py-8 lg:p-10">
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
