import { App, Button, Form, Input, Spin } from 'antd';
import React, { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { AppUrl } from '@adapters/ui/app.enum';
import { CenteredLayout } from '@adapters/ui/components/Layout/CenteredLayout';
import { useNotificationError } from '@adapters/ui/hooks/useNotification';
import { useUserByToken } from '@adapters/ui/hooks/users/useUserByToken';

type LoginFormValues = {
  newPassword: string;
};

export const EnrollPage = () => {
  const notificationError = useNotificationError();

  const navigate = useNavigate();

  const { token } = useParams<{ email?: string; token?: string }>();

  const { data, isLoading } = useUserByToken(token);

  const { message } = App.useApp();

  useEffect(() => {
    if (Meteor.user()) {
      Meteor.logout();
    }
  }, []);

  if (!token) {
    return <Navigate to={AppUrl.Home} />;
  }

  if (isLoading) {
    return <Spin spinning />;
  }

  const submit = (values: LoginFormValues) => {
    if (token) {
      Accounts.resetPassword(token, values.newPassword, (error) => {
        if (error) {
          notificationError(error.message);
        } else {
          message.success('Usuario activado');

          navigate(AppUrl.Home);
        }
      });
    }
  };

  return (
    <CenteredLayout>
      <Form<LoginFormValues>
        onFinish={(values) => submit(values)}
        layout="vertical"
        requiredMark={false}
        initialValues={{
          email: data?.emails ? data.emails[0].address : '',
        }}
      >
        <Form.Item label="Email" name="email">
          <Input
            disabled
            size="large"
            className="text-sm"
            type="email"
            placeholder="Ingresa tu email"
          />
        </Form.Item>

        <Form.Item
          label="Clave"
          name="newPassword"
          rules={[{ required: true }]}
        >
          <Input.Password
            size="large"
            className="text-sm"
            placeholder="Ingresa tu clave"
          />
        </Form.Item>

        <Form.Item
          className="mb-16"
          label="Repetir nueva clave"
          name="repeatPassword"
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator: (_, value) => {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error('Las claves no coinciden'));
              },
            }),
          ]}
          dependencies={['newPassword']}
        >
          <Input.Password
            size="large"
            className="text-sm"
            placeholder="Repetir la nueva clave"
          />
        </Form.Item>
        <Button
          block
          className="rounded-bl-none rounded-br-[10px] rounded-tl-[10px] rounded-tr-none"
          type="primary"
          htmlType="submit"
        >
          Activar mi cuenta
        </Button>
      </Form>
    </CenteredLayout>
  );
};
