import type {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
} from '@club-social/types/users';

import {
  Button,
  Card,
  Group,
  Loader,
  LoadingOverlay,
  Stack,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { z } from 'zod';

import { APP_ROUTES } from '@/app/app.enum';
import { NotFound } from '@/components/NotFound';
import { $fetch } from '@/shared/lib/api';
import { useMutation } from '@/shared/lib/useMutation';
import { useQuery } from '@/shared/lib/useQuery';

const _schema = z.object({
  email: z.email('Email inválido'),
  firstName: z.string().min(1, 'Nombre Requerido'),
  lastName: z.string().min(1, 'Apellido requerido'),
});

type FormSchema = z.infer<typeof _schema>;

export function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { setValues, ...form } = useForm<FormSchema>({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
    },
    mode: 'uncontrolled',
    validate: zod4Resolver(_schema),
  });

  const userQuery = useQuery<null | UserDto>({
    enabled: !!id,
    queryFn: () => $fetch(`users/${id}`),
    queryKey: ['user', id],
  });

  const createUserMutation = useMutation<UserDto, Error, CreateUserDto>({
    mutationFn: (body) => $fetch('users', { body }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      notifications.show({ message: 'Usuario creado correctamente' });
      navigate(`${APP_ROUTES.USER_LIST}/${data.id}`, { replace: true });
    },
  });

  const updateUserMutation = useMutation<UserDto, Error, UpdateUserDto>({
    mutationFn: (body) => $fetch(`users/${id}`, { body, method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      notifications.show({ message: 'Usuario actualizado correctamente' });
      navigate(-1);
    },
  });

  useEffect(() => {
    if (userQuery.data) {
      setValues({
        email: userQuery.data.email,
        firstName: userQuery.data.firstName,
        lastName: userQuery.data.lastName,
      });
    }
  }, [userQuery.data, setValues]);

  const onSubmit = async (data: FormSchema) => {
    if (id) {
      updateUserMutation.mutate({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    } else {
      createUserMutation.mutate({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    }
  };

  if (userQuery.isLoading) {
    return <Loader />;
  }

  if (id && !userQuery.data) {
    return <NotFound />;
  }

  return (
    <Card withBorder>
      <Card.Section fw="bold" p="md" withBorder>
        {userQuery.data
          ? `${userQuery.data.firstName} ${userQuery.data.lastName}`
          : 'Nuevo usuario'}
      </Card.Section>

      <Card.Section className="relative" p="md" withBorder>
        <form id="form" onSubmit={form.onSubmit(onSubmit)}>
          <LoadingOverlay visible={form.submitting} />
          <Stack>
            <TextInput
              key={form.key('firstName')}
              {...form.getInputProps('firstName')}
              label="Nombre"
            />
            <TextInput
              key={form.key('lastName')}
              {...form.getInputProps('lastName')}
              label="Apellido"
            />
            <TextInput
              key={form.key('email')}
              {...form.getInputProps('email')}
              label="Email"
              type="email"
            />
          </Stack>
        </form>
      </Card.Section>
      <Card.Section p="md">
        <Group justify="space-between">
          <Button
            color="gray"
            disabled={
              createUserMutation.isPending || updateUserMutation.isPending
            }
            leftSection={<IconX />}
            onClick={() => navigate(-1)}
            variant="transparent"
          >
            Cancelar
          </Button>
          <Button
            disabled={
              createUserMutation.isPending || updateUserMutation.isPending
            }
            form="form"
            leftSection={<IconCheck />}
            loading={
              createUserMutation.isPending || updateUserMutation.isPending
            }
            type="submit"
          >
            {id ? 'Actualizar usuario' : 'Crear usuario'}
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
}
