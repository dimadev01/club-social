import React, { useEffect, useState } from 'react';
import { Breadcrumb, Card, Input } from 'antd';
import { isEqual } from 'lodash';
import { NavLink } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { Grid } from '@ui/components/Grid';
import { useGrid } from '@ui/hooks/useGrid';
import { useRemoveUser } from '@ui/hooks/users/useRemoveUser';
import { useUsersGrid } from '@ui/hooks/users/useUsersGrid';

export const UsersPage = () => {
  const [gridState, setGridState] = useGrid({
    sortField: 'profile',
    sortOrder: 'ascend',
  });

  const [search, setSearch] = useState(gridState.search);

  const [searchDebounced] = useDebounce(search, 750);

  useEffect(() => {
    setGridState((p) => ({ ...p, page: 1, search: searchDebounced }));
  }, [searchDebounced, setGridState]);

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
        <Input.Search
          placeholder="Buscar..."
          allowClear
          className="mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value ?? '')}
        />

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
              render: (emails: Meteor.UserEmail[]) =>
                emails.map((email) => (
                  <React.Fragment key={email.address}>
                    <span>{email.address} </span>(
                    {email.verified ? <CheckOutlined /> : <CloseOutlined />})
                  </React.Fragment>
                )),
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
