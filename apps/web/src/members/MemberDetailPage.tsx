import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Group, Select, Stack, TextInput } from '@mantine/core';
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
  const reactHookForm = useForm<FormSchema>({
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

      <Card.Section p="md" withBorder>
        <form className="relative">
          <Stack>
            <TextInput
              {...reactHookForm.register('firstName', { required: true })}
              error={reactHookForm.formState.errors.firstName?.message}
              label="Nombre"
            />
            <TextInput
              {...reactHookForm.register('lastName', { required: true })}
              error={reactHookForm.formState.errors.lastName?.message}
              label="Apellido"
            />
            <TextInput
              {...reactHookForm.register('email', { required: true })}
              error={reactHookForm.formState.errors.email?.message}
              label="Email"
              type="email"
            />
            <Select
              {...reactHookForm.register('role', { required: true })}
              data={['admin', 'user']}
              error={reactHookForm.formState.errors.role?.message}
              label="Rol"
              onChange={(value) => {
                reactHookForm.setValue('role', value as 'admin' | 'user');
              }}
            />
          </Stack>
        </form>
      </Card.Section>
      <Card.Section p="md">
        <Group justify="space-between">
          <Button leftSection={<IconX />} variant="default">
            Cancelar
          </Button>
          <Button
            leftSection={<IconCheck />}
            onClick={reactHookForm.handleSubmit(onSubmit)}
          >
            Guardar
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
}
