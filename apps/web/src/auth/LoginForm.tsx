import { LoginOutlined } from '@ant-design/icons';
import { Alert, App, Button, Card, Flex, Form, Image, Input } from 'antd';
import { useState } from 'react';

import { betterAuthClient } from '@/shared/lib/better-auth.client';
import { MenuThemeSwitcher } from '@/ui/MenuThemeSwitcher';

interface FormSchema {
  email: string;
}

const FormStatus = {
  IDLE: 'idle',
  SUBMITTING: 'submitting',
  SUCCESS: 'success',
} as const;

type FormStatus = (typeof FormStatus)[keyof typeof FormStatus];

export function LoginForm() {
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.IDLE);
  const { message } = App.useApp();

  const [form] = Form.useForm<FormSchema>();

  const onSubmit = async (values: FormSchema) => {
    setFormStatus(FormStatus.SUBMITTING);

    const { error } = await betterAuthClient.signIn.magicLink({
      callbackURL: window.location.origin,
      email: values.email,
    });

    setFormStatus(error ? FormStatus.IDLE : FormStatus.SUCCESS);

    if (error) {
      message.error(error.message);
    }
  };

  const isSubmitting = formStatus === FormStatus.SUBMITTING;

  return (
    <Flex className="w-full max-w-xs" gap="small" vertical>
      <Image
        alt="Club Social Logo"
        className="mx-auto max-w-[128px]"
        preview={false}
        rootClassName="w-full"
        src="/club-social-logo.png"
      />

      {formStatus === FormStatus.SUCCESS && (
        <Alert
          closable={{
            afterClose: () => setFormStatus(FormStatus.IDLE),
            closeIcon: true,
          }}
          description="Le hemos enviado un link para iniciar sesión"
          type="success"
        />
      )}

      {formStatus !== FormStatus.SUCCESS && (
        <Card
          actions={[
            <Button
              disabled={isSubmitting}
              form="form"
              htmlType="submit"
              icon={<LoginOutlined />}
              loading={isSubmitting}
              type="primary"
            >
              Iniciar sesión
            </Button>,
          ]}
          extra={<MenuThemeSwitcher />}
          title="Club Social Monte Grande"
        >
          <Form<FormSchema>
            disabled={isSubmitting}
            form={form}
            id="form"
            initialValues={{ email: 'info@clubsocialmontegrande.ar' }}
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
        </Card>
      )}
    </Flex>
  );
}
