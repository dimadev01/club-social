import React from 'react';
import { Breadcrumb, Card, Form, Input, Select, Spin } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import { uniq } from 'lodash';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { Role } from '@domain/roles/roles.enum';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { InputEmailList } from '@ui/components/InputEmailList';
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
        emails: values.emails,
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role,
      });
    } else {
      updateUser.mutate({
        emails: values.emails,
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

          <Form.List
            name="emails"
            rules={[
              {
                validator: async (_, names) => {
                  if (uniq(names).length !== names.length) {
                    return Promise.reject(
                      new Error('No se pueden ingresar emails duplicados')
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item required label="Email" key={field.key}>
                    <Form.Item
                      {...field}
                      label="Email"
                      rules={[
                        { required: true },
                        { type: 'email' },
                        { whitespace: true },
                      ]}
                      noStyle
                    >
                      <InputEmailList
                        add={add}
                        remove={remove}
                        fieldName={field.name}
                        index={index}
                      />
                    </Form.Item>
                    <Form.ErrorList className="text-red-500" errors={errors} />
                  </Form.Item>
                ))}
              </>
            )}
          </Form.List>

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
