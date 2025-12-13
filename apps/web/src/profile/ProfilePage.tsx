import { SaveOutlined, UserOutlined } from '@ant-design/icons';
import { App, Button, Card, Form, Input, Space } from 'antd';

import { useUser } from '@/auth/useUser';
import { Page, PageContent } from '@/components/Page';
import { betterAuthClient } from '@/shared/lib/better-auth.client';

interface FormSchema {
  email: string;
  firstName: string;
  lastName: string;
}

export function ProfilePage() {
  const { message } = App.useApp();

  const user = useUser();

  const [form] = Form.useForm<FormSchema>();

  const onSubmit = async (values: FormSchema) => {
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
      message.success('Perfil actualizado correctamente');
    }

    if (user.email !== values.email) {
      const { data, error } = await betterAuthClient.changeEmail({
        callbackURL: window.location.origin,
        newEmail: values.email,
      });

      if (error) {
        message.error(error.message);
      } else if (data) {
        message.success('Le hemos enviado un link para cambiar su email');
      }
    }
  };

  return (
    <Page>
      <PageContent>
        <Card
          actions={[
            <Button
              form="form"
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
              Mi Perfil
            </Space>
          }
        >
          <Form<FormSchema>
            autoComplete="off"
            form={form}
            id="form"
            initialValues={{
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            }}
            layout="vertical"
            name="form"
            onFinish={onSubmit}
            scrollToFirstError
          >
            <Form.Item<FormSchema>
              label="Nombre"
              name="firstName"
              rules={[{ required: true, whitespace: true }]}
            >
              <Input placeholder="Juan" />
            </Form.Item>
            <Form.Item<FormSchema>
              label="Apellido"
              name="lastName"
              rules={[{ required: true, whitespace: true }]}
            >
              <Input placeholder="Perez" />
            </Form.Item>
            <Form.Item<FormSchema>
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
