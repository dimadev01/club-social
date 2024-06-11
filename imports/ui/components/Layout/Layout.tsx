import {
  CreditCardFilled,
  FilePdfFilled,
  LogoutOutlined,
  MailFilled,
  NotificationFilled,
  WhatsAppOutlined,
} from '@ant-design/icons';
import {
  Layout as AntLayout,
  Col,
  Flex,
  Image,
  Menu,
  Row,
  Space,
  Typography,
} from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { FaExchangeAlt, FaFileInvoiceDollar, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { ThemeSelect } from '@ui/components/Layout/ThemeSelect';
import { useIsInRole } from '@ui/hooks/auth/useIsInRole';
import { useLoggedInUser } from '@ui/hooks/auth/useLoggedInUser';
import { useThemeContext } from '@ui/providers/ThemeContext';

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const user = useLoggedInUser();

  const canReadMembers = useIsInRole(PermissionEnum.READ, ScopeEnum.MEMBERS);

  const canReadDues = useIsInRole(PermissionEnum.READ, ScopeEnum.DUES);

  const canReadPayments = useIsInRole(PermissionEnum.READ, ScopeEnum.PAYMENTS);

  const canReadMovements = useIsInRole(
    PermissionEnum.READ,
    ScopeEnum.MOVEMENTS,
  );

  const { theme } = useThemeContext();

  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(true);

  const [isMenuResponsiveMode, setIsMenuResponsiveMode] =
    useState<boolean>(false);

  const pathnameKey = `/${window.location.pathname.split('/')[1]}`;

  const [menuKey, setMenuKey] = useState<string>(pathnameKey);

  useEffect(() => {
    setMenuKey(pathnameKey);
  }, [pathnameKey]);

  const getMenuItems = (): ItemType[] => {
    const items: ItemType[] = [];

    if (canReadMembers) {
      items.push({
        icon: <FaUsers className="!text-lg" />,
        key: AppUrl.Members,
        label: (
          <Link className="no-underline" to={AppUrl.Members}>
            Socios
          </Link>
        ),
      });
    }

    if (canReadDues) {
      items.push({
        icon: <FaFileInvoiceDollar className="!text-lg" />,
        key: AppUrl.Dues,
        label: (
          <Link className="no-underline" to={AppUrl.Dues}>
            Cobros
          </Link>
        ),
      });
    }

    if (canReadPayments) {
      items.push({
        icon: <CreditCardFilled className="!text-lg" />,
        key: AppUrl.Payments,
        label: (
          <Link className="no-underline" to={AppUrl.Payments}>
            Pagos
          </Link>
        ),
      });
    }

    if (canReadMovements) {
      items.push({
        icon: <FaExchangeAlt className="!text-lg" />,
        key: AppUrl.Movements,
        label: (
          <Link className="no-underline" to={AppUrl.Movements}>
            Movimientos
          </Link>
        ),
      });
    }

    return items;
  };

  const userName = `${user.profile?.firstName} ${user.profile?.lastName}`;

  return (
    <AntLayout hasSider className="cs-layout">
      <AntLayout.Sider
        collapsed={isMenuCollapsed}
        onCollapse={setIsMenuCollapsed}
        breakpoint="lg"
        collapsedWidth="0"
        className="cs-sider"
        width={260}
        theme={theme}
        onBreakpoint={(broken) => setIsMenuResponsiveMode(broken)}
      >
        <Image
          wrapperClassName="py-8 px-16 w-full"
          preview={false}
          src="/images/logo.png"
          alt="Rixsus Logo"
        />

        <div className="mb-20 px-8">
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

        <Menu
          className="cs-menu"
          selectedKeys={[menuKey]}
          onClick={({ key }) => {
            setMenuKey(key);

            if (isMenuResponsiveMode) {
              setIsMenuCollapsed(true);
            }
          }}
          items={getMenuItems()}
        />

        <Menu
          className="cs-menu !mb-8 mt-auto"
          items={[
            {
              icon: <LogoutOutlined className="!text-lg" />,
              key: 'logout',
              label: (
                <Link className="no-underline" to={AppUrl.Logout}>
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
                icon={<FilePdfFilled />}
                htmlType="button"
                type="text"
                href="https://drive.google.com/file/d/1_rFbEf4z5Rx801ElUYfdk4qrCOv-maj_/view?usp=drive_link"
                target="_blank"
              />
              <Button
                tooltip={{ title: 'Comunicados' }}
                icon={<NotificationFilled />}
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
                  icon={<MailFilled />}
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
