import type { ParamId } from '@club-social/shared/types';

import {
  type ICreateUserDto,
  type IUpdateUserDto,
  type IUserDetailDto,
  UserStatus,
  UserStatusLabel,
} from '@club-social/shared/users';
import { useQueryClient } from '@tanstack/react-query';
import { App, Button, Card, Form, Input, Select, Skeleton, Space } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { useMutation } from '@/shared/hooks/useMutation';
import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { BackIcon } from '@/ui/Icons/BackIcon';
import { SaveIcon } from '@/ui/Icons/SaveIcon';

interface FormSchema {
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
}

export function UserDetailPage() {
  const { message } = App.useApp();

  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form] = Form.useForm<FormSchema>();
  const { setFieldsValue } = form;

  const userQuery = useQuery<IUserDetailDto | null>({
    enabled: !!id,
    queryFn: () => $fetch(`users/${id}`),
    queryKey: ['users', id],
  });

  const createUserMutation = useMutation<ParamId, Error, ICreateUserDto>({
    mutationFn: (body) => $fetch('users', { body }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate(`${APP_ROUTES.USER_DETAIL.replace(':id', data.id)}`, {
        replace: true,
      });
      message.success('Usuario creado correctamente');
    },
  });

  const updateUserMutation = useMutation<unknown, Error, IUpdateUserDto>({
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
        status: userQuery.data.status,
      });
    }
  }, [userQuery.data, setFieldsValue]);

  const onSubmit = async (values: FormSchema) => {
    if (id) {
      updateUserMutation.mutate({
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        status: values.status,
      });
    } else {
      createUserMutation.mutate({
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
      });
    }
  };

  const isLoading =
    userQuery.isLoading ||
    createUserMutation.isPending ||
    updateUserMutation.isPending;

  return (
    <Card
      actions={[
        <Button
          disabled={isLoading}
          icon={<BackIcon />}
          onClick={() => navigate(-1)}
          type="link"
        >
          Cancelar
        </Button>,
        <Button
          disabled={isLoading}
          form="form"
          htmlType="submit"
          icon={<SaveIcon />}
          loading={createUserMutation.isPending || updateUserMutation.isPending}
          type="primary"
        >
          {id ? 'Actualizar usuario' : 'Crear usuario'}
        </Button>,
      ]}
      loading={userQuery.isLoading}
      title={
        <Space>
          {userQuery.isLoading && <Skeleton.Input active />}
          {!userQuery.isLoading && (
            <>{id ? userQuery.data?.name : 'Nuevo usuario'}</>
          )}
        </Space>
      }
    >
      <Form<FormSchema>
        autoComplete="off"
        disabled={isLoading}
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

        {id && (
          <Form.Item<FormSchema>
            label="Estado"
            name="status"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                {
                  label: UserStatusLabel[UserStatus.ACTIVE],
                  value: UserStatus.ACTIVE,
                },
                {
                  label: UserStatusLabel[UserStatus.INACTIVE],
                  value: UserStatus.INACTIVE,
                },
              ]}
              placeholder="Seleccionar estado"
            />
          </Form.Item>
        )}
      </Form>
    </Card>
  );
}
