import {
  FilePdfOutlined,
  LogoutOutlined,
  MailOutlined,
  NotificationOutlined,
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
import { Roles } from 'meteor/alanning:roles';
import React, { useEffect, useState } from 'react';
import {
  FaCreditCard,
  FaExchangeAlt,
  FaFileInvoiceDollar,
  FaUsers,
} from 'react-icons/fa';
import { Link, Navigate } from 'react-router-dom';

import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { UserThemeEnum } from '@domain/users/user.enum';
import { LocalStorageUtils } from '@shared/utils/localStorage.utils';
import { AppUrl } from '@ui/app.enum';
import { useThemeContext } from '@ui/AppContext';
import { Button } from '@ui/components/Button';
import { Select } from '@ui/components/Select';
import { useUpdateUserTheme } from '@ui/hooks/users/useUpdateUserTheme';

type Props = {
  children: JSX.Element;
};

export const Layout: React.FC<Props> = ({ children }) => {
  const { setTheme, theme } = useThemeContext();

  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(true);

  const [isMenuResponsiveMode, setIsMenuResponsiveMode] =
    useState<boolean>(false);

  const pathnameKey = `/${window.location.pathname.split('/')[1]}`;

  const [menuKey, setMenuKey] = useState<string>(pathnameKey);

  const updateUserTheme = useUpdateUserTheme();

  useEffect(() => {
    LocalStorageUtils.set('theme', theme);
  }, [updateUserTheme, theme]);

  useEffect(() => {
    setMenuKey(pathnameKey);
  }, [pathnameKey]);

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  const getMenuItems = (): ItemType[] => {
    const items: ItemType[] = [];

    // if (Roles.userIsInRole(user, PermissionEnum.READ, ScopeEnum.USERS)) {
    //   items.push({
    //     icon: <UserOutlined className="!text-lg" />,
    //     key: AppUrl.Users,
    //     label: <Link to={AppUrl.Users}>Usuarios</Link>,
    //   });
    // }

    if (Roles.userIsInRole(user, PermissionEnum.READ, ScopeEnum.MEMBERS)) {
      items.push({
        icon: <FaUsers className="!text-lg" />,
        key: AppUrl.Members,
        label: <Link to={AppUrl.Members}>Socios</Link>,
      });
    }

    if (Roles.userIsInRole(user, PermissionEnum.READ, ScopeEnum.MOVEMENTS)) {
      items.push({
        icon: <FaExchangeAlt className="!text-lg" />,
        key: AppUrl.Movements,
        label: <Link to={AppUrl.Movements}>Movimientos</Link>,
      });
    }

    if (Roles.userIsInRole(user, PermissionEnum.READ, ScopeEnum.DUES)) {
      items.push({
        icon: <FaFileInvoiceDollar className="!text-lg" />,
        key: AppUrl.Dues,
        label: <Link to={AppUrl.Dues}>Cobros</Link>,
      });
    }

    if (Roles.userIsInRole(user, PermissionEnum.READ, ScopeEnum.PAYMENTS)) {
      items.push({
        icon: <FaCreditCard className="!text-lg" />,
        key: AppUrl.Payments,
        label: <Link to={AppUrl.Payments}>Pagos</Link>,
      });
    }

    // if (Roles.userIsInRole(user, PermissionEnum.READ, ScopeEnum.CATEGORIES)) {
    //   items.push({
    //     icon: <BankOutlined className="!text-lg" />,
    //     key: AppUrl.Categories,
    //     label: <Link to={AppUrl.Categories}>Categorías</Link>,
    //   });
    // }

    // if (Roles.userIsInRole(user, PermissionEnum.READ, ScopeEnum.PROFESSORS)) {
    //   items.push({
    //     icon: <UserOutlined className="!text-lg" />,
    //     key: AppUrl.Professors,
    //     label: <Link to={AppUrl.Professors}>Profesores</Link>,
    //   });
    // }

    // if (Roles.userIsInRole(user, PermissionEnum.READ, ScopeEnum.EMPLOYEES)) {
    //   items.push({
    //     icon: <UserOutlined className="!text-lg" />,
    //     key: AppUrl.Employees,
    //     label: <Link to={AppUrl.Employees}>Empleados</Link>,
    //   });
    // }

    // if (Roles.userIsInRole(user, PermissionEnum.READ, ScopeEnum.SERVICES)) {
    //   items.push({
    //     icon: <BulbOutlined className="!text-lg" />,
    //     key: AppUrl.Services,
    //     label: <Link to={AppUrl.Services}>Servicios</Link>,
    //   });
    // }

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
              label: <Link to={AppUrl.Logout}>Cerrar sesión</Link>,
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
              <Select
                allowClear={false}
                value={user?.profile?.theme}
                showSearch={false}
                onChange={(value) => {
                  setTheme(value);

                  updateUserTheme.mutate({ theme: value });
                }}
                options={[
                  {
                    label: 'Claro',
                    value: UserThemeEnum.LIGHT,
                  },
                  {
                    label: 'Oscuro',
                    value: UserThemeEnum.DARK,
                  },
                  {
                    label: 'Automático',
                    value: UserThemeEnum.AUTO,
                  },
                ]}
              />

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
