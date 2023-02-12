import React from 'react';
import { Card } from 'antd';
import { NavLink } from 'react-router-dom';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { Grid } from '@ui/components/Grid';
import { PageHeader } from '@ui/components/PageHeader';
import { useGrid } from '@ui/hooks/useGrid';
import { useUsersGrid } from '@ui/hooks/useUsersGrid';

export const UsersPage = () => {
  const [gridState, setGridState] = useGrid();

  const { data, isLoading, isRefetching, refetch } = useUsersGrid({
    page: gridState.page ?? 1,
    pageSize: gridState.pageSize ?? 20,
  });

  return (
    <>
      <PageHeader>Usuarios</PageHeader>

      <Card
        extra={
          <>
            <Button
              onClick={() => refetch()}
              loading={isRefetching}
              disabled={isRefetching}
              tooltip={{ title: 'Recargar' }}
              htmlType="button"
              type="ghost"
              icon={<ReloadOutlined />}
            />

            <NavLink to={AppUrl.UsersNew}>
              <Button
                icon={<PlusOutlined />}
                type="ghost"
                htmlType="button"
                tooltip={{ title: 'Nuevo' }}
              />
            </NavLink>
          </>
        }
      >
        <Grid<Meteor.User>
          total={data?.total ?? 0}
          gridState={gridState}
          onStateChange={setGridState}
          loading={isLoading}
          dataSource={data?.data}
          columns={[
            {
              dataIndex: 'profile',
              render: (profile: Meteor.UserProfile, user: Meteor.User) => (
                <NavLink to={`${AppUrl.Users}/${user._id}`}>
                  {profile.firstName} {profile.lastName}
                </NavLink>
              ),
              title: 'Nombre',
            },
            {
              dataIndex: ['profile', 'role'],
              title: 'Rol',
            },
          ]}
        />
      </Card>
    </>
  );
};
