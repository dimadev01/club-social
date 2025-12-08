import { LoginOutlined } from '@ant-design/icons';
import { Alert, App, Button, Card, Flex, Form, Image, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { MenuThemeSwitcher } from '@/components/MenuThemeSwitcher';
import { betterAuthClient } from '@/shared/lib/better-auth.client';

interface FormSchema {
  email: string;
}

const FormStatus = {
  IDLE: 'idle',
  SUBMITTING: 'submitting',
  SUCCESS: 'success',
} as const;

type ErrorTypes = Partial<
  Record<
    keyof typeof betterAuthClient.$ERROR_CODES,
    {
      en: string;
      es: string;
    }
  >
>;

type FormStatus = (typeof FormStatus)[keyof typeof FormStatus];

const errorCodes = {
  USER_ALREADY_EXISTS: {
    en: 'user already registered',
    es: 'usuario ya registrado',
  },
} satisfies ErrorTypes;

const getErrorMessage = (code: string, lang: 'en' | 'es') => {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes][lang];
  }

  return '';
};

export function LoginForm() {
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.IDLE);
  const { message } = App.useApp();
  const { error } = useParams();

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

  useEffect(() => {
    if (error) {
      message.error(getErrorMessage(error, 'es'));
    }
  }, [error, message]);

  // useEffect(() => {
  //   loginWithRedirect();
  // }, [loginWithRedirect]);

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

      <Flex justify="end">
        <MenuThemeSwitcher />
      </Flex>
    </Flex>
  );
}
