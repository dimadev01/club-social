import type { ParamId } from '@club-social/shared/types';

import {
  type ICreateUserDto,
  type IUpdateUserDto,
  type IUserDetailDto,
  UserStatus,
  UserStatusLabel,
} from '@club-social/shared/users';
import { useQueryClient } from '@tanstack/react-query';
import { App, Button, Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { useMutation } from '@/shared/hooks/useMutation';
import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { Card } from '@/ui/Card';
import { SaveIcon } from '@/ui/Icons/SaveIcon';
import { NotFound } from '@/ui/NotFound';

import { usePermissions } from './use-permissions';

interface FormSchema {
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
}

export function UserDetailPage() {
  const { message } = App.useApp();
  const permissions = usePermissions();

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

  if (!permissions.users.create && !id) {
    return <NotFound />;
  }

  if (!permissions.users.update && id) {
    return <NotFound />;
  }

  const isQueryLoading = userQuery.isLoading;
  const isMutating =
    createUserMutation.isPending || updateUserMutation.isPending;

  const canCreate = !id && permissions.users.create;
  const canUpdate = id && permissions.users.update;
  const canCreateOrUpdate = canCreate || canUpdate;

  if (id && !isQueryLoading && !userQuery.data) {
    return <NotFound />;
  }

  return (
    <Card
      actions={[
        canCreateOrUpdate && (
          <Button
            disabled={isMutating}
            form="form"
            htmlType="submit"
            icon={<SaveIcon />}
            loading={isMutating}
            type="primary"
          >
            {id ? 'Actualizar usuario' : 'Crear usuario'}
          </Button>
        ),
      ].filter(Boolean)}
      backButton
      loading={isQueryLoading}
      title={userQuery.data?.name ?? 'Nuevo usuario'}
    >
      <Form<FormSchema>
        autoComplete="off"
        disabled={isMutating}
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
