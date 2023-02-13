import React from 'react';
import { Breadcrumb, Card } from 'antd';
import { NavLink } from 'react-router-dom';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { RemoveUserRequestDto } from '@domain/users/use-cases/remove-user/remove-user-request.dto';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { useMutation } from '@tanstack/react-query';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { Grid } from '@ui/components/Grid';
import { PageHeader } from '@ui/components/PageHeader';
import { useGrid } from '@ui/hooks/useGrid';
import { useUsersGrid } from '@ui/hooks/users/useUsersGrid';

export const UsersPage = () => {
  const [gridState, setGridState] = useGrid();

  const { data, isLoading, isRefetching, refetch } = useUsersGrid({
    page: gridState.page ?? 1,
    pageSize: gridState.pageSize ?? 20,
  });

  const removeOne = useMutation<undefined, Error, RemoveUserRequestDto>(
    [MethodsEnum.UsersRemove],
    (request) => Meteor.callAsync(MethodsEnum.UsersRemove, request),
    { onSuccess: refetch }
  );

  return (
    <>
      <PageHeader>Usuarios</PageHeader>

      <Breadcrumb className="mb-8">
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Usuarios</Breadcrumb.Item>
      </Breadcrumb>

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
