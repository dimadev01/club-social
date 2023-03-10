import React, { useState } from 'react';
import { Col, Image, Layout as AntLayout, Menu, Row, Typography } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { Roles } from 'meteor/alanning:roles';
import { Navigate, NavLink } from 'react-router-dom';
import {
  BankOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Permission, Scope } from '@domain/roles/roles.enum';
import { AppUrl } from '@ui/app.enum';

type Props = {
  children: JSX.Element;
};

export const Layout: React.FC<Props> = ({ children }) => {
  const [menuKey, setMenuKey] = useState<string>(
    `/${window.location.pathname.split('/')[1]}`
  );

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  const getMenuItems = (): ItemType[] => {
    const items: ItemType[] = [];

    items.push({
      icon: <HomeOutlined className="!text-lg" />,
      key: AppUrl.Home,
      label: <NavLink to={AppUrl.Home}>Inicio</NavLink>,
    });

    if (Roles.userIsInRole(user, Permission.Read, Scope.Users)) {
      items.push({
        icon: <UserOutlined className="!text-lg" />,
        key: AppUrl.Users,
        label: <NavLink to={AppUrl.Users}>Usuarios</NavLink>,
      });
    }

    if (Roles.userIsInRole(user, Permission.Read, Scope.Members)) {
      items.push({
        icon: <UserOutlined className="!text-lg" />,
        key: AppUrl.Members,
        label: <NavLink to={AppUrl.Members}>Socios</NavLink>,
      });
    }

    if (Roles.userIsInRole(user, Permission.Read, Scope.Movements)) {
      items.push({
        icon: <BankOutlined className="!text-lg" />,
        key: AppUrl.Movements,
        label: <NavLink to={AppUrl.Movements}>Movimientos</NavLink>,
      });
    }

    if (Roles.userIsInRole(user, Permission.Read, Scope.Categories)) {
      items.push({
        icon: <BankOutlined className="!text-lg" />,
        key: AppUrl.Categories,
        label: <NavLink to={AppUrl.Categories}>Categorías</NavLink>,
      });
    }

    if (Roles.userIsInRole(user, Permission.Read, Scope.Professors)) {
      items.push({
        icon: <UserOutlined className="!text-lg" />,
        key: AppUrl.Professors,
        label: <NavLink to={AppUrl.Professors}>Profesores</NavLink>,
      });
    }

    if (Roles.userIsInRole(user, Permission.Read, Scope.Employees)) {
      items.push({
        icon: <UserOutlined className="!text-lg" />,
        key: AppUrl.Employees,
        label: <NavLink to={AppUrl.Employees}>Empleados</NavLink>,
      });
    }

    if (Roles.userIsInRole(user, Permission.Read, Scope.Rentals)) {
      items.push({
        icon: <UserOutlined className="!text-lg" />,
        key: AppUrl.Rentals,
        label: <NavLink to={AppUrl.Rentals}>Alquileres</NavLink>,
      });
    }

    return items;
  };

  return (
    <AntLayout className="cs-layout min-h-full">
      <AntLayout.Sider
        breakpoint="lg"
        collapsedWidth="0"
        className="!bg-[#f8f9fd] cs-sider"
        width={260}
      >
        <NavLink to={AppUrl.Home} onClick={() => setMenuKey(AppUrl.Home)}>
          <Image
            wrapperClassName="py-8 px-20 w-full"
            preview={false}
            src="/images/logo.png"
            alt="Rixsus Logo"
          />
        </NavLink>

        <div className="mb-20 px-8">
          <Row align="middle" wrap={false}>
            <Col flex={1} className="pl-4">
              <Typography.Text className="block font-light text-base">
                Hola,
              </Typography.Text>
              <Typography.Text className="block font-medium text-base">
                {user.profile?.firstName} {user.profile?.lastName}
              </Typography.Text>
            </Col>
          </Row>
        </div>

        <Menu
          className="!bg-[#f8f9fd] cs-menu"
          selectedKeys={[menuKey]}
          onClick={({ key }) => setMenuKey(key)}
          items={getMenuItems()}
        />

        <Menu
          className="!bg-[#f8f9fd] cs-menu mt-auto !mb-8"
          items={[
            {
              icon: <LogoutOutlined className="!text-lg" />,
              key: 'logout',
              label: <NavLink to={AppUrl.Logout}>Cerrar sesión</NavLink>,
            },
          ]}
        />
      </AntLayout.Sider>

      <AntLayout className="cs-layout-content">
        <AntLayout.Content className="px-4 py-8 sm:p-14 ">
          {children}
        </AntLayout.Content>
      </AntLayout>
    </AntLayout>
  );
};
