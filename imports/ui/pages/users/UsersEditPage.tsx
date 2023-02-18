import React from 'react';
import { Breadcrumb, Card, Form, Input, message, Select, Spin } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import { compact } from 'lodash';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { Role } from '@domain/roles/roles.enum';
import { AppUrl } from '@ui/app.enum';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormListEmails } from '@ui/components/Form/FormListEmails';
import { FormSaveButton } from '@ui/components/Form/FormSaveButton';
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

  const { data: user, fetchStatus } = useUser(id);

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
      });

      message.success('Usuario actualizado');
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
            emails: user?.emails?.map((email) => email.address) ?? [''],
            firstName: user?.profile?.firstName ?? '',
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
            <ButtonGroup>
              <FormSaveButton />

              <FormBackButton to={AppUrl.Users} />
            </ButtonGroup>
          </ButtonGroup>
        </Form>
      </Card>
    </>
  );
};
