import { MailOutlined, UserOutlined } from '@ant-design/icons';
import { App, Button, Card, Col, Form, Input, Space } from 'antd';
import { useState } from 'react';

import { useUser } from '@/auth/useUser';
import { betterAuthClient } from '@/shared/lib/better-auth.client';
import { SaveIcon } from '@/ui/Icons/SaveIcon';
import { Row } from '@/ui/Row';

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

  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  const onSubmitProfile = async (values: ProfileFormSchema) => {
    setIsSubmittingProfile(true);
    const { data, error } = await betterAuthClient.updateUser({
      firstName: values.firstName,
      lastName: values.lastName,
      name: `${values.firstName} ${values.lastName}`,
      updatedAt: new Date(),
      updatedBy: user.name,
    });
    setIsSubmittingProfile(false);

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

    setIsSubmittingEmail(true);
    const { data, error } = await betterAuthClient.changeEmail({
      callbackURL: window.location.origin,
      newEmail: values.email,
    });
    setIsSubmittingEmail(false);

    if (error) {
      message.error(error.message);
    } else if (data) {
      message.success('Le hemos enviado un link para cambiar su email');
    }
  };

  return (
    <Card title="Perfil">
      <Row>
        <Col md={12} xs={24}>
          <Card
            actions={[
              <Button
                disabled={isSubmittingProfile}
                form="profileForm"
                htmlType="submit"
                icon={<SaveIcon />}
                loading={isSubmittingProfile}
                type="primary"
              >
                Actualizar perfil
              </Button>,
            ]}
            size="small"
            title={
              <Space>
                <UserOutlined />
                Mis datos
              </Space>
            }
            type="inner"
          >
            <Form<ProfileFormSchema>
              autoComplete="off"
              disabled={isSubmittingProfile}
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
        </Col>

        <Col md={12} xs={24}>
          <Card
            actions={[
              <Button
                disabled={isSubmittingEmail}
                form="emailForm"
                htmlType="submit"
                icon={<MailOutlined />}
                loading={isSubmittingEmail}
                type="primary"
              >
                Cambiar email
              </Button>,
            ]}
            size="small"
            title={
              <Space>
                <MailOutlined />
                Inicio de sesión
              </Space>
            }
            type="inner"
          >
            <Form<EmailFormSchema>
              autoComplete="off"
              disabled={isSubmittingEmail}
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
        </Col>
      </Row>
    </Card>
  );
}
