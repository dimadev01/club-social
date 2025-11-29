import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  Group,
  LoadingOverlay,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const _schema = z.object({
  email: z.email('Email inválido'),
  firstName: z.string().min(1, 'Nombre Requerido'),
  lastName: z.string().min(1, 'Apellido requerido'),
  role: z.enum(['admin', 'user'], { error: 'Rol requerido' }),
});

type FormSchema = z.infer<typeof _schema>;

export function MemberDetailPage() {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
  } = useForm<FormSchema>({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      role: undefined,
    },
    resolver: zodResolver(_schema),
  });

  const onSubmit = (data: FormSchema) => {
    console.log('firstName', 'John');
    console.log(data);
  };

  return (
    <Card withBorder>
      <Card.Section fw="bold" p="md" withBorder>
        Nuevo Usuario
      </Card.Section>

      <Card.Section className="relative" p="md" withBorder>
        <LoadingOverlay visible={isSubmitting} />
        <Stack>
          <TextInput
            {...register('firstName')}
            error={errors.firstName?.message}
            label="Nombre"
          />
          <TextInput
            {...register('lastName')}
            error={errors.lastName?.message}
            label="Apellido"
          />
          <TextInput
            {...register('email')}
            error={errors.email?.message}
            label="Email"
            type="email"
          />
          <Select
            {...register('role')}
            data={['admin', 'user']}
            error={errors.role?.message}
            label="Rol"
            onChange={(value) => {
              setValue('role', value as 'admin' | 'user');
            }}
          />
        </Stack>
      </Card.Section>
      <Card.Section p="md">
        <Group justify="space-between">
          <Button leftSection={<IconX />} variant="default">
            Cancelar
          </Button>
          <Button leftSection={<IconCheck />} onClick={handleSubmit(onSubmit)}>
            Guardar
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
}
