import { TeamOutlined } from '@ant-design/icons';
import { Card, Checkbox, Form, Input, Space } from 'antd';
import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { RoleEnum, ScopeEnum } from '@domain/roles/role.enum';
import { UrlUtils } from '@shared/utils/url.utils';
import { Breadcrumbs } from '@ui/components/Breadcrumbs/Breadcrumbs';
import { FormButtons } from '@ui/components/Form/FormButtons';
import { Select } from '@ui/components/Select';
import { useNotificationSuccess } from '@ui/hooks/ui/useNotification';
import { useCreateUser } from '@ui/hooks/users/useCreateUser';
import { useUpdateUser } from '@ui/hooks/users/useUpdateUser';
import { useUser } from '@ui/hooks/users/useUser';

type FormValues = {
  email: string;
  firstName: string;
  isActive?: boolean;
  lastName: string;
  role: RoleEnum;
};

export const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();

  const notificationSuccess = useNotificationSuccess();

  const location = useLocation();

  const { data: user, fetchStatus: userFetchStatus } = useUser(
    id ? { id } : undefined,
  );

  const isLoading = userFetchStatus === 'fetching';

  const [form] = Form.useForm<FormValues>();

  const navigate = useNavigate();

  const createUser = useCreateUser();

  const updateUser = useUpdateUser();

  const handleSubmit = async (values: FormValues) => {
    if (!user) {
      await createUser.mutateAsync(
        {
          email: values.email,
          emails: [values.email],
          firstName: values.firstName,
          lastName: values.lastName,
          role: values.role,
          unitOfWork: null,
        },
        {
          onSuccess: () => {
            notificationSuccess('Usuario creado');

            navigate(-1);
          },
        },
      );
    } else {
      invariant(id);

      if (values.isActive === undefined) {
        throw new Error('isActive is required');
      }

      await updateUser.mutateAsync(
        {
          email: values.email,
          emails: [values.email],
          firstName: values.firstName,
          id,
          isActive: values.isActive,
          lastName: values.lastName,
          role: values.role,
          unitOfWork: null,
        },
        {
          onSuccess: () => {
            notificationSuccess('Usuario actualizado');

            navigate(-1);
          },
        },
      );
    }
  };

  return (
    <>
      <Breadcrumbs
        items={[
          {
            title: (
              <Space>
                <TeamOutlined />
                <Link to={`..${UrlUtils.stringify(location.state)}`}>
                  Usuarios
                </Link>
              </Space>
            ),
          },
          { title: user ? user.name : 'Nuevo Usuario' },
        ]}
      />

      <Card
        extra={<TeamOutlined />}
        loading={isLoading}
        title={user ? user.name : 'Nuevo Usuario'}
      >
        <Form<FormValues>
          layout="vertical"
          form={form}
          onFinish={(values) => handleSubmit(values)}
          disabled={createUser.isLoading}
          initialValues={{
            email: user?.emails?.[0].address,
            firstName: user?.firstName,
            isActive: user?.isActive,
            lastName: user?.lastName,
            role: user?.role ?? RoleEnum.STAFF,
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

          <Form.Item
            rules={[{ required: true, type: 'email', whitespace: true }]}
            label="Email"
            name="email"
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item label="Rol" name="role" rules={[{ required: true }]}>
            <Select
              options={[
                {
                  label: 'Staff',
                  value: RoleEnum.STAFF,
                },
              ]}
            />
          </Form.Item>

          {user && (
            <Form.Item
              rules={[{ required: true }]}
              label="Activo"
              name="isActive"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
          )}

          <div className="mb-4" />

          <FormButtons
            saveButtonProps={{
              text: user ? 'Actualizar Usuario' : 'Crear Usuario',
            }}
            scope={ScopeEnum.USERS}
          />
        </Form>
      </Card>
    </>
  );
};
