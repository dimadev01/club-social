import { KeyOutlined, MailOutlined } from '@ant-design/icons';
import {
  Alert,
  App,
  Button,
  Card,
  Divider,
  Flex,
  Form,
  Image,
  Space,
} from 'antd';
import { useState } from 'react';

import { useMutation } from '@/shared/hooks/useMutation';
import { betterAuthClient } from '@/shared/lib/better-auth.client';
import { Input } from '@/ui';

interface FormSchema {
  email: string;
}

const LoginMode = {
  MAGIC_LINK_SENT: 'magic-link-sent',
} as const;

type LoginMode = (typeof LoginMode)[keyof typeof LoginMode];

export function LoginForm() {
  const { message } = App.useApp();
  const [mode, setMode] = useState<LoginMode | null>(null);
  const [form] = Form.useForm<FormSchema>();

  const singInMagicLinkMutation = useMutation({
    mutationFn: (values: FormSchema) =>
      betterAuthClient.signIn.magicLink({
        callbackURL: window.location.origin,
        email: values.email,
      }),
    onSuccess: ({ data, error }) => {
      if (data) {
        setMode(LoginMode.MAGIC_LINK_SENT);
      }

      if (error) {
        message.error('Error al iniciar sesión con email');
      }
    },
  });

  const signInPasskeyMutation = useMutation({
    mutationFn: () => betterAuthClient.signIn.passkey(),
    onSuccess: ({ error }) => {
      if (error) {
        message.error('Error al iniciar sesión con passkey');
      }
    },
  });

  const onSubmit = (values: FormSchema) => {
    singInMagicLinkMutation.mutate(values);
  };

  return (
    <Flex className="w-full max-w-xs" gap="small" vertical>
      <Image
        alt="Club Social Logo"
        className="mx-auto max-w-[128px]"
        preview={false}
        rootClassName="w-full"
        src="/club-social-logo.png"
      />

      {mode === LoginMode.MAGIC_LINK_SENT && (
        <Alert
          closable={{
            closeIcon: true,
            onClose: () => setMode(null),
          }}
          description="Le hemos enviado un link para iniciar sesión"
          type="success"
        />
      )}

      {mode === null && (
        <Card title="Club Social Monte Grande">
          <Form<FormSchema>
            disabled={singInMagicLinkMutation.isPending}
            form={form}
            id="form"
            initialValues={{ email: undefined }}
            layout="vertical"
            name="form"
            onFinish={onSubmit}
            scrollToFirstError
          >
            <Form.Item<FormSchema>
              label="Email"
              name="email"
              rules={[{ required: true, type: 'email', whitespace: true }]}
              tooltip="Recibirás un link para iniciar sesión"
            >
              <Input placeholder="juan.perez@example.com" type="email" />
            </Form.Item>
          </Form>

          <Divider />

          <Space.Compact block vertical>
            <Button
              block
              disabled={singInMagicLinkMutation.isPending}
              form="form"
              htmlType="submit"
              icon={<MailOutlined />}
              loading={singInMagicLinkMutation.isPending}
              type="default"
            >
              Iniciar sesión con email
            </Button>
            <Button
              block
              disabled={signInPasskeyMutation.isPending}
              icon={<KeyOutlined />}
              loading={signInPasskeyMutation.isPending}
              onClick={() => signInPasskeyMutation.mutate()}
              type="default"
            >
              Iniciar sesión con passkey
            </Button>
          </Space.Compact>
        </Card>
      )}
    </Flex>
  );
}
