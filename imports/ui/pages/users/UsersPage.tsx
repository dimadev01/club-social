import React from 'react';
import { Breadcrumb, Card, Space, Tooltip, Typography } from 'antd';
import { isEqual } from 'lodash';
import { NavLink } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
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
    page: gridState.page,
    pageSize: gridState.pageSize,
    search: gridState.search,
    sortField: gridState.sortField,
    sortOrder: gridState.sortOrder,
  });

  const removeOne = useRemoveUser(refetch);

  return (
    <>
      <Breadcrumb className="mb-8">
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Usuarios</Breadcrumb.Item>
      </Breadcrumb>

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
          total={data?.total ?? 0}
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
              align: 'center',
              dataIndex: 'emails',
              render: (emails: Meteor.UserEmail[] | undefined) =>
                emails && (
                  <Space direction="vertical">
                    {emails.map((email) => (
                      <Typography.Text key={email.address} copyable>
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
              sortOrder: isEqual(gridState.sortField, ['profile', 'role'])
                ? gridState.sortOrder
                : undefined,
              sorter: true,
              title: 'Rol',
            },
            {
              align: 'center',
              render: (_, user: Meteor.User) => (
                <Button
                  popConfirm={{
                    onConfirm: () =>
                      removeOne.mutate(
                        { id: user._id },
                        { onError: () => removeOne.reset() }
                      ),
                    title: '¿Está seguro de eliminar este usuario?',
                  }}
                  type="ghost"
                  htmlType="button"
                  tooltip={{ title: 'Eliminar ' }}
                  icon={<DeleteOutlined />}
                  loading={removeOne.variables?.id === user._id}
                  disabled={removeOne.variables?.id === user._id}
                />
              ),
              title: 'Actions',
              width: 100,
            },
          ]}
        />
      </Card>
    </>
  );
};
