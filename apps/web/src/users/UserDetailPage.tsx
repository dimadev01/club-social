import type {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
} from '@club-social/types/users';

import { CloseOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { App, Button, Card, Form, Input, Skeleton, Space } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { Page, PageContent } from '@/components/Page';
import { $fetch } from '@/shared/lib/api';
import { useMutation } from '@/shared/lib/useMutation';
import { useQuery } from '@/shared/lib/useQuery';

interface FormSchema {
  email: string;
  firstName: string;
  lastName: string;
}

export function UserDetailPage() {
  const { message } = App.useApp();

  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form] = Form.useForm<FormSchema>();
  const { setFieldsValue } = form;

  const userQuery = useQuery<null | UserDto>({
    enabled: !!id,
    queryFn: () => $fetch(`users/${id}`),
    queryKey: ['users', id],
  });

  const createUserMutation = useMutation<UserDto, Error, CreateUserDto>({
    mutationFn: (body) => $fetch('users', { body }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate(`${APP_ROUTES.USER_DETAIL.replace(':id', data.id)}`, {
        replace: true,
      });
      message.success('Usuario creado correctamente');
    },
  });

  const updateUserMutation = useMutation<UserDto, Error, UpdateUserDto>({
    mutationFn: (body) => $fetch(`users/${id}`, { body, method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
      message.success('Usuario actualizado correctamente');
      navigate(-1);
    },
  });

  useEffect(() => {
    if (userQuery.data) {
      setFieldsValue({
        email: userQuery.data.email,
        firstName: userQuery.data.firstName,
        lastName: userQuery.data.lastName,
      });
    }
  }, [userQuery.data, setFieldsValue]);

  const onSubmit = async (values: FormSchema) => {
    if (id) {
      updateUserMutation.mutate(values);
    } else {
      createUserMutation.mutate(values);
    }
  };

  return (
    <Page>
      <PageContent>
        <Card
          actions={[
            <Button
              disabled={
                userQuery.isLoading ||
                createUserMutation.isPending ||
                updateUserMutation.isPending
              }
              icon={<CloseOutlined />}
              onClick={() => navigate(-1)}
              type="link"
            >
              Cancelar
            </Button>,
            <Button
              disabled={
                userQuery.isLoading ||
                createUserMutation.isPending ||
                updateUserMutation.isPending
              }
              form="form"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={
                createUserMutation.isPending || updateUserMutation.isPending
              }
              type="primary"
            >
              {id ? 'Actualizar usuario' : 'Crear usuario'}
            </Button>,
          ]}
          loading={userQuery.isLoading}
          title={
            <Space>
              <UserOutlined />
              {userQuery.isLoading && <Skeleton.Input active />}
              {!userQuery.isLoading && (
                <>{id ? userQuery.data?.name : 'Nuevo usuario'}</>
              )}
            </Space>
          }
        >
          <Form<FormSchema>
            form={form}
            id="form"
            initialValues={{ email: '', firstName: '', lastName: '' }}
            layout="vertical"
            name="form"
            onFinish={onSubmit}
            scrollToFirstError
          >
            <Form.Item<FormSchema>
              label="Nombre"
              name="firstName"
              rules={[{ required: true, whitespace: true }]}
            >
              <Input placeholder="Juan" />
            </Form.Item>
            <Form.Item<FormSchema>
              label="Apellido"
              name="lastName"
              rules={[{ required: true, whitespace: true }]}
            >
              <Input placeholder="Perez" />
            </Form.Item>
            <Form.Item<FormSchema>
              label="Email"
              name="email"
              rules={[{ required: true, type: 'email', whitespace: true }]}
              tooltip="Será su email de acceso"
            >
              <Input placeholder="juan.perez@example.com" type="email" />
            </Form.Item>
          </Form>
        </Card>
      </PageContent>
    </Page>
  );
}
