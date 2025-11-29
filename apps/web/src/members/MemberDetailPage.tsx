import {
  Button,
  Card,
  Group,
  LoadingOverlay,
  Stack,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconX } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useNavigate } from 'react-router';
import { z } from 'zod';

const _schema = z.object({
  email: z.email('Email inválido'),
  firstName: z.string().min(1, 'Nombre Requerido'),
  lastName: z.string().min(1, 'Apellido requerido'),
});

type FormSchema = z.infer<typeof _schema>;

export function MemberDetailPage() {
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

  const onSubmit = (data: FormSchema) => {
    console.log(data);
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
            leftSection={<IconX />}
            onClick={() => navigate(-1)}
            variant="default"
          >
            Cancelar
          </Button>
          <Button form="form" leftSection={<IconCheck />} type="submit">
            Guardar
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
}
