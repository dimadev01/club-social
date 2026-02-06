import { usePostHog } from '@posthog/react';
import { App } from 'antd';

import { useSessionUser } from '@/auth/useUser';
import { useMutation } from '@/shared/hooks/useMutation';
import { betterAuthClient } from '@/shared/lib/better-auth.client';
import { PostHogEvent } from '@/shared/lib/posthog-events';
import { Button, Card, Form, Input } from '@/ui';

interface ProfileFormSchema {
  firstName: string;
  lastName: string;
}

export function ProfileTab() {
  const { message } = App.useApp();
  const posthog = usePostHog();
  const user = useSessionUser();
  const [form] = Form.useForm<ProfileFormSchema>();

  const submitProfileMutation = useMutation({
    mutationFn: (values: ProfileFormSchema) =>
      betterAuthClient.updateUser({
        firstName: values.firstName,
        lastName: values.lastName,
        name: `${values.firstName} ${values.lastName}`,
        updatedAt: new Date(),
        updatedBy: user.name,
      }),
    onSuccess: ({ error }) => {
      if (error) {
        message.error('Error al actualizar perfil');

        return;
      }

      message.success('Perfil actualizado');
      posthog.capture(PostHogEvent.PROFILE_UPDATED);
    },
  });

  const onSubmitProfile = (values: ProfileFormSchema) => {
    submitProfileMutation.mutate(values);
  };

  return (
    <Card
      actions={[
        <Button
          disabled={submitProfileMutation.isPending}
          form="profileForm"
          htmlType="submit"
          loading={submitProfileMutation.isPending}
          type="primary"
        >
          Actualizar perfil
        </Button>,
      ]}
      title="Mis datos"
    >
      <Form<ProfileFormSchema>
        autoComplete="off"
        disabled={submitProfileMutation.isPending}
        form={form}
        id="profileForm"
        initialValues={{
          firstName: user.firstName,
          lastName: user.lastName,
        }}
        layout="vertical"
        name="profileForm"
        onFinish={onSubmitProfile}
        scrollToFirstError
      >
        <Form.Item<ProfileFormSchema>
          label="Nombre"
          name="firstName"
          rules={[{ required: true, whitespace: true }]}
        >
          <Input placeholder="Juan" />
        </Form.Item>
        <Form.Item<ProfileFormSchema>
          label="Apellido"
          name="lastName"
          rules={[{ required: true, whitespace: true }]}
        >
          <Input placeholder="Perez" />
        </Form.Item>
      </Form>
    </Card>
  );
}
