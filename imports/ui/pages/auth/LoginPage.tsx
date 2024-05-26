import { App, Button, Form, Input } from 'antd';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppUrl } from '@ui/app.enum';
import { CenteredLayout } from '@ui/components/Layout/CenteredLayout';

type FormValues = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const { isLoggingIn } = useTracker(() => ({
    isLoggingIn: Meteor.loggingIn(),
  }));

  const { message } = App.useApp();

  const navigate = useNavigate();

  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const login = (values: FormValues) => {
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
              message.error('El email ingresado no existe');
            } else {
              message.error(error.message);
            }
          } else if (error instanceof Error) {
            message.error(error.message);
          }
        } else {
          navigate(AppUrl.LoginPasswordless.replace(':email', values.email));
        }
      },
    );
  };

  return (
    <CenteredLayout>
      <Form<FormValues>
        onFinish={(values) => login(values)}
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
    </CenteredLayout>
  );
};
