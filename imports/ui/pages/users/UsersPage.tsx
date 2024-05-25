import React from 'react';
import { Breadcrumb, Card, Space, Tooltip, Typography } from 'antd';
import { NavLink } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { RoleEnum } from '@domain/roles/role.enum';
import { RoleService } from '@domain/roles/role.service';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { Table } from '@ui/components/Table/Table';
import { TableNewButton } from '@ui/components/Table/TableNewButton';
import { TableReloadButton } from '@ui/components/Table/TableReloadButton';
import { useGrid } from '@ui/hooks/useGrid';
import { useRemoveUser } from '@ui/hooks/users/useRemoveUser';
import { useUsersGrid } from '@ui/hooks/users/useUsersGrid';

export const UsersPage = () => {
  const [gridState, setGridState] = useGrid({
    sortField: 'profile',
    sortOrder: 'ascend',
  });

  const { data, isLoading, isRefetching, refetch } = useUsersGrid({
    filters: gridState.filters,
    page: gridState.page,
    pageSize: gridState.pageSize,
    search: gridState.search,
    sortField: gridState.sortField,
    sortOrder: gridState.sortOrder,
  });

  const removeUser = useRemoveUser(refetch);

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          {
            title: 'Inicio',
          },
          {
            title: 'Usuarios',
          },
        ]}
      />

      <Card
        title="Usuarios"
        extra={
          <>
            <TableReloadButton isRefetching={isRefetching} refetch={refetch} />

            <TableNewButton to={AppUrl.UsersNew} />
          </>
        }
      >
        <Table<Meteor.User>
          total={data?.count ?? 0}
          showSearch
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
              sortOrder:
                gridState.sortField === 'profile'
                  ? gridState.sortOrder
                  : undefined,
              sorter: true,
              title: 'Nombre',
            },
            {
              dataIndex: 'emails',
              render: (emails: Meteor.UserEmail[] | undefined) =>
                emails && (
                  <Space direction="vertical">
                    {emails.map((email) => (
                      <Typography.Text
                        key={email.address}
                        copyable={{ text: email.address }}
                      >
                        <Tooltip
                          title={
                            email.verified
                              ? 'Email verificado'
                              : 'Email no verificado'
                          }
                          key={email.address}
                        >
                          {email.address}
                        </Tooltip>
                      </Typography.Text>
                    ))}
                  </Space>
                ),
              title: 'Emails',
            },
            {
              align: 'center',
              dataIndex: ['profile', 'role'],
              filteredValue: gridState.filters?.['profile.role'],
              filters: RoleService.findForSelect(),
              title: 'Rol',
            },
            {
              align: 'center',
              render: (_, user: Meteor.User) =>
                user.profile?.role === RoleEnum.Staff && (
                  <Button
                    popConfirm={{
                      onConfirm: () =>
                        removeUser.mutate(
                          { id: user._id },
                          { onError: () => removeUser.reset() },
                        ),
                      title: '¿Está seguro de eliminar este usuario?',
                    }}
                    type="text"
                    htmlType="button"
                    tooltip={{ title: 'Eliminar' }}
                    icon={<DeleteOutlined />}
                    loading={removeUser.variables?.id === user._id}
                    disabled={removeUser.variables?.id === user._id}
                  />
                ),
              title: 'Acciones',
              width: 100,
            },
          ]}
        />
      </Card>
    </>
  );
};
