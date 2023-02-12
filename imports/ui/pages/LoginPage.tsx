import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { AppUrl } from '@ui/app.enum';
import { CenteredLayout } from '@ui/components/Layout/CenteredLayout';

type LoginFormValues = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const { isLoggingIn } = useTracker(() => ({
    isLoggingIn: Meteor.loggingIn(),
  }));

  const navigate = useNavigate();

  const login = (values: LoginFormValues) => {
    Meteor.loginWithPassword(values.email, values.password, (error) => {
      if (error) {
        message.error(error.message);
      } else {
        navigate(AppUrl.Home);
      }
    });
  };

  return (
    <CenteredLayout>
      <Form<LoginFormValues>
        onFinish={(values) => login(values)}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true }, { type: 'email' }]}
        >
          <Input
            size="large"
            className="text-sm"
            type="email"
            placeholder="Ingresa tu email"
          />
        </Form.Item>

        <Form.Item
          className="mb-16"
          label="Clave"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password
            size="large"
            className="text-sm"
            placeholder="Ingresa tu clave"
          />
        </Form.Item>

        <Button
          block
          className="rounded-bl-none rounded-tr-none rounded-tl-[10px] rounded-br-[10px]"
          type="primary"
          htmlType="submit"
          disabled={isLoggingIn}
          loading={isLoggingIn}
        >
          Iniciar Sesión
        </Button>
      </Form>
    </CenteredLayout>
  );
};
