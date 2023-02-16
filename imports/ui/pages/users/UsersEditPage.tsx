import React from 'react';
import { Breadcrumb, Card, Form, Input, Select, Spin } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { Role } from '@domain/roles/roles.enum';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { NotFound } from '@ui/components/NotFound';
import { useCreateUser } from '@ui/hooks/users/useCreateUser';
import { useUpdateUser } from '@ui/hooks/users/useUpdateUser';
import { useUser } from '@ui/hooks/users/useUser';

type FormValues = {
  emails: string[];
  firstName: string;
  lastName: string;
  role: string;
};

export const UsersDetailPage = () => {
  const { id } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const { data: user, fetchStatus } = useUser(id);

  const createUser = useCreateUser();

  const updateUser = useUpdateUser();

  const handleSubmit = (values: FormValues) => {
    if (!user) {
      createUser.mutate({
        emails: values.emails[0],
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role,
      });
    } else {
      updateUser.mutate({
        email: values.emails[0],
        firstName: values.firstName,
        id: user._id,
        lastName: values.lastName,
      });
    }
  };

  if (fetchStatus === 'fetching') {
    return <Spin spinning />;
  }

  if (id && !user) {
    return <NotFound />;
  }

  return (
    <>
      <Breadcrumb className="mb-8">
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to={AppUrl.Users}>Usuarios</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {!!user && `${user.profile?.firstName} ${user.profile?.lastName}`}
          {!user && 'Nuevo Usuario'}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        <Form<FormValues>
          layout="vertical"
          onFinish={(values) => handleSubmit(values)}
          initialValues={{
            emails: user?.emails?.map((email) => email.address) ?? [],
            firstName: user?.profile?.firstName ?? '',
            lastName: user?.profile?.lastName ?? '',
            rol: user?.profile?.role ?? '',
          }}
        >
          <Form.Item
            name="firstName"
            label="Nombre"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Apellido"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          {/* <Form.Item name="emails" label="Emails" rules={[{ required: true }]}>
            <Select mode="tags" />
          </Form.Item> */}

          {!user && (
            <Form.Item name="role" label="Rol" rules={[{ required: true }]}>
              <Select
                placeholder="Seleccionar"
                options={[
                  {
                    label: 'Staff',
                    value: Role.Staff,
                  },
                ]}
              />
            </Form.Item>
          )}

          <ButtonGroup>
            <Button
              type="primary"
              disabled={createUser.isLoading || updateUser.isLoading}
              loading={createUser.isLoading || updateUser.isLoading}
              htmlType="submit"
            >
              Guardar
            </Button>
            <Button type="text" onClick={() => navigate(AppUrl.Users)}>
              Atrás
            </Button>
          </ButtonGroup>
        </Form>
      </Card>
    </>
  );
};
