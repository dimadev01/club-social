import { Button, Form, Input } from 'antd';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppUrl } from '@ui/app.enum';
import { useNotificationError } from '@ui/hooks/ui/useNotification';

type FormValues = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const { isLoggingIn } = useTracker(() => ({
    isLoggingIn: Meteor.loggingIn(),
  }));

  const notificationError = useNotificationError();

  const navigate = useNavigate();

  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleLogin = (values: FormValues) => {
    setIsSendingEmail(true);

    // @ts-expect-error
    Accounts.requestLoginTokenForUser(
      {
        options: {
          userCreationDisabled: true,
        },
        selector: values.email,
      },
      (error: unknown) => {
        setIsSendingEmail(false);

        if (error) {
          if (error instanceof Meteor.Error) {
            if (error.error === 403) {
              notificationError('El email no está registrado');
            } else {
              notificationError(error.message);
            }
          } else if (error instanceof Error) {
            notificationError(error.message);
          }
        } else {
          navigate(
            AppUrl.AUTH_LOGIN_PASSWORDLESS.replace(':email', values.email),
          );
        }
      },
    );
  };

  return (
    <Form<FormValues>
      onFinish={(values) => handleLogin(values)}
      layout="vertical"
      requiredMark={false}
    >
      <Form.Item
        label="Email"
        name="email"
        className="mb-16"
        rules={[{ required: true }, { type: 'email' }]}
      >
        <Input
          autoFocus
          size="large"
          className="text-sm"
          type="email"
          placeholder="Ingresa tu email"
        />
      </Form.Item>

      <div className="flex justify-between">
        <Button
          className="flex-1 rounded-bl-none rounded-br-[10px] rounded-tl-[10px] rounded-tr-none"
          type="primary"
          htmlType="submit"
          disabled={isLoggingIn || isSendingEmail}
          loading={isLoggingIn || isSendingEmail}
        >
          Iniciar Sesión
        </Button>
      </div>
    </Form>
  );
};
