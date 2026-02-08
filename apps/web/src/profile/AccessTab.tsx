import { MailOutlined } from '@ant-design/icons';
import { usePostHog } from '@posthog/react';
import { App } from 'antd';

import { useSessionUser } from '@/auth/useUser';
import { useMutation } from '@/shared/hooks/useMutation';
import { betterAuthClient } from '@/shared/lib/better-auth.client';
import { PostHogEvent } from '@/shared/lib/posthog-events';
import { Button, Card, Form, Input } from '@/ui';

interface EmailFormSchema {
  email: string;
}

export function AccessTab() {
  const { message } = App.useApp();
  const posthog = usePostHog();
  const user = useSessionUser();
  const [form] = Form.useForm<EmailFormSchema>();

  const submitEmailMutation = useMutation({
    mutationFn: (values: EmailFormSchema) =>
      betterAuthClient.changeEmail({
        callbackURL: window.location.origin,
        newEmail: values.email,
      }),
    onSuccess: ({ error }) => {
      if (error) {
        message.error('Error al cambiar email');

        return;
      }

      message.success('Link de verificación enviado');
      posthog.capture(PostHogEvent.EMAIL_CHANGE_REQUESTED);
    },
  });

  const onSubmitEmail = (values: EmailFormSchema) => {
    if (user.email === values.email) {
      message.info('El email ingresado es el mismo que el actual');

      return;
    }

    submitEmailMutation.mutate(values);
  };

  return (
    <Card
      actions={[
        <Button
          disabled={submitEmailMutation.isPending}
          form="emailForm"
          htmlType="submit"
          icon={<MailOutlined />}
          loading={submitEmailMutation.isPending}
          type="primary"
        >
          Cambiar email
        </Button>,
      ]}
      title="Inicio de sesión"
    >
      <Form<EmailFormSchema>
        autoComplete="off"
        disabled={submitEmailMutation.isPending}
        form={form}
        id="emailForm"
        initialValues={{
          email: user.email,
        }}
        layout="vertical"
        name="emailForm"
        onFinish={onSubmitEmail}
        scrollToFirstError
      >
        <Form.Item<EmailFormSchema>
          label="Email"
          name="email"
          rules={[{ required: true, type: 'email', whitespace: true }]}
        >
          <Input
            className="sm:w-60"
            placeholder="juan.perez@example.com"
            type="email"
          />
        </Form.Item>
      </Form>
    </Card>
  );
}
