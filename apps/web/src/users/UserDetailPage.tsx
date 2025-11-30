import { betterFetch } from '@better-fetch/fetch';
import {
  Button,
  Card,
  Group,
  LoadingOverlay,
  Stack,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useNavigate } from 'react-router';
import { z } from 'zod';

const _schema = z.object({
  email: z.email('Email inválido'),
  firstName: z.string().min(1, 'Nombre Requerido'),
  lastName: z.string().min(1, 'Apellido requerido'),
});

type FormSchema = z.infer<typeof _schema>;

export function UserDetailPage() {
  const navigate = useNavigate();

  const form = useForm<FormSchema>({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
    },
    mode: 'uncontrolled',
    validate: zod4Resolver(_schema),
  });

  const createUserMutation = useMutation({
    mutationFn: (data: FormSchema) =>
      betterFetch('http://localhost:3000/users', { body: data }),
  });

  const onSubmit = async (data: FormSchema) => {
    const { error } = await createUserMutation.mutateAsync(data);

    if (error) {
      console.log(error);
      notifications.show({
        color: 'red',
        message: error.message,
      });
    } else {
      notifications.show({
        message: 'Usuario creado correctamente',
      });
    }
  };

  return (
    <Card withBorder>
      <Card.Section fw="bold" p="md" withBorder>
        Nuevo Usuario
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
            disabled={createUserMutation.isPending}
            leftSection={<IconX />}
            onClick={() => navigate(-1)}
            variant="transparent"
          >
            Cancelar
          </Button>
          <Button
            disabled={createUserMutation.isPending}
            form="form"
            leftSection={<IconCheck />}
            loading={createUserMutation.isPending}
            type="submit"
          >
            Crear usuario
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
}
