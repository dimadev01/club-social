import { MailOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons';
import { App, Button, Card, Divider, Form, Input, Space } from 'antd';

import { useUser } from '@/auth/useUser';
import { Page, PageContent } from '@/components/Page';
import { betterAuthClient } from '@/shared/lib/better-auth.client';

interface EmailFormSchema {
  email: string;
}

interface ProfileFormSchema {
  firstName: string;
  lastName: string;
}

export function ProfilePage() {
  const { message } = App.useApp();

  const user = useUser();

  const [profileForm] = Form.useForm<ProfileFormSchema>();
  const [emailForm] = Form.useForm<EmailFormSchema>();

  const onSubmitProfile = async (values: ProfileFormSchema) => {
    const { data, error } = await betterAuthClient.updateUser({
      firstName: values.firstName,
      lastName: values.lastName,
      name: `${values.firstName} ${values.lastName}`,
      updatedAt: new Date(),
      updatedBy: user.name,
    });

    if (error) {
      message.error(error.message);
    } else if (data) {
      message.success('Perfil actualizado');
    }
  };

  const onSubmitEmail = async (values: EmailFormSchema) => {
    if (user.email === values.email) {
      message.info('El email ingresado es el mismo que el actual');

      return;
    }

    const { data, error } = await betterAuthClient.changeEmail({
      callbackURL: window.location.origin,
      newEmail: values.email,
    });

    if (error) {
      message.error(error.message);
    } else if (data) {
      message.success('Le hemos enviado un link para cambiar su email');
    }
  };

  return (
    <Page>
      <PageContent>
        <Card
          actions={[
            <Button
              form="profileForm"
              htmlType="submit"
              icon={<SaveOutlined />}
              type="primary"
            >
              Actualizar perfil
            </Button>,
          ]}
          title={
            <Space>
              <UserOutlined />
              Mis datos
            </Space>
          }
        >
          <Form<ProfileFormSchema>
            autoComplete="off"
            form={profileForm}
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

        <Divider />

        <Card
          actions={[
            <Button
              form="emailForm"
              htmlType="submit"
              icon={<MailOutlined />}
              type="primary"
            >
              Cambiar email
            </Button>,
          ]}
          title={
            <Space>
              <MailOutlined />
              Inicio de sesión
            </Space>
          }
        >
          <Form<EmailFormSchema>
            autoComplete="off"
            form={emailForm}
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
              <Input placeholder="juan.perez@example.com" type="email" />
            </Form.Item>
          </Form>
        </Card>
      </PageContent>
    </Page>
  );
}
