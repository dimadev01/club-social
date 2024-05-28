import { App, Breadcrumb, Card, Checkbox, Form, Input, Skeleton } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import compact from 'lodash/compact';
import React from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

import { RoleEnum } from '@domain/roles/role.enum';
import { UserStateEnum } from '@domain/users/user.enum';
import { AppUrl } from '@ui/app.enum';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormListEmails } from '@ui/components/Form/FormListEmails';
import { FormSaveButton } from '@ui/components/Form/FormSaveButton';
import { NotFound } from '@ui/components/NotFound';
import { Select } from '@ui/components/Select';
import { useCreateUser } from '@ui/hooks/users/useCreateUser';
import { useUpdateUser } from '@ui/hooks/users/useUpdateUser';
import { useUser } from '@ui/hooks/users/useUser';

type FormValues = {
  emails: string[];
  firstName: string;
  isActive: boolean;
  lastName: string;
  role: RoleEnum;
};

export const UsersDetailPage = () => {
  const { id } = useParams<{ id?: string }>();

  const { data: user, fetchStatus } = useUser(id);

  const { message } = App.useApp();

  const navigate = useNavigate();

  const createUser = useCreateUser();

  const updateUser = useUpdateUser();

  const handleSubmit = async (values: FormValues) => {
    if (!user) {
      const userId = await createUser.mutateAsync({
        emails: compact(values.emails).length > 0 ? values.emails : null,
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role,
      });

      message.success('Usuario creado');

      navigate(`${AppUrl.Users}/${userId}`);
    } else {
      await updateUser.mutateAsync({
        emails: compact(values.emails).length > 0 ? values.emails : null,
        firstName: values.firstName,
        id: user._id,
        lastName: values.lastName,
        state: values.isActive ? UserStateEnum.ACTIVE : UserStateEnum.INACTIVE,
      });

      message.success('Usuario actualizado');
    }
  };

  const isLoading = fetchStatus === 'fetching';

  if (id && !user && !isLoading) {
    return <NotFound />;
  }

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          {
            title: 'Inicio',
          },
          {
            title: <NavLink to={AppUrl.Users}>Usuarios</NavLink>,
          },
          {
            title: user
              ? `${user.profile?.lastName} ${user.profile?.firstName}`
              : 'Nuevo Usuario',
          },
        ]}
      />

      <Skeleton active loading={isLoading}>
        <Card>
          <Form<FormValues>
            layout="vertical"
            onFinish={(values) => handleSubmit(values)}
            initialValues={{
              emails:
                user?.emails && user.emails.length > 0
                  ? user.emails.map((email) => email.address)
                  : [''],
              firstName: user?.profile?.firstName ?? '',
              // @ts-ignore
              isActive: user?.profile?.state === UserStateEnum.ACTIVE ?? true,
              lastName: user?.profile?.lastName ?? '',
              rol: user?.profile?.role ?? '',
            }}
          >
            <Form.Item
              name="firstName"
              label="Nombre"
              rules={[{ required: true, whitespace: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Apellido"
              rules={[{ required: true, whitespace: true }]}
            >
              <Input />
            </Form.Item>

            <FormListEmails />

            {!user && (
              <Form.Item name="role" label="Rol" rules={[{ required: true }]}>
                <Select
                  options={[
                    {
                      label: 'Staff',
                      value: RoleEnum.STAFF,
                    },
                    {
                      label: 'Viewer',
                      value: RoleEnum.VIEWER,
                    },
                  ]}
                />
              </Form.Item>
            )}

            <Form.Item name="isActive" label="Activo" valuePropName="checked">
              <Checkbox />
            </Form.Item>

            <ButtonGroup>
              <FormSaveButton
                loading={createUser.isLoading || updateUser.isLoading}
                disabled={createUser.isLoading || updateUser.isLoading}
              />

              <FormBackButton
                disabled={createUser.isLoading || updateUser.isLoading}
              />
            </ButtonGroup>
          </Form>
        </Card>
      </Skeleton>
    </>
  );
};
