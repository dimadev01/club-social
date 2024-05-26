import { ReloadOutlined } from '@ant-design/icons';
import { App, Form, Input, Space } from 'antd';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { CenteredLayout } from '@ui/components/Layout/CenteredLayout';
import { UiNotificationUtils } from '@ui/utils/messages.utils';

type FormValues = {
  token: string;
};

export const LoginPasswordlessPage = () => {
  const { isLoggingIn } = useTracker(() => ({
    isLoggingIn: Meteor.loggingIn(),
  }));

  const { email } = useParams<{ email?: string }>();

  const navigate = useNavigate();

  const { notification, message } = App.useApp();

  const [isSendingEmail, setIsSendingEmail] = useState(false);

  if (!email) {
    return <Navigate to={AppUrl.Login} />;
  }

  const login = (values: FormValues) => {
    // @ts-expect-error
    Meteor.passwordlessLoginWithToken(email, values.token, (error: unknown) => {
      if (error) {
        if (error instanceof Meteor.Error && error.error === 403) {
          UiNotificationUtils.error(notification, 'Clave de acceso incorrecta');
        } else if (error instanceof Error) {
          UiNotificationUtils.error(notification, error.message);
        }
      } else {
        navigate(AppUrl.Home);
      }
    });
  };

  const resendEmail = () => {
    setIsSendingEmail(true);

    // @ts-expect-error
    Accounts.requestLoginTokenForUser({ selector: email }, (error: unknown) => {
      setIsSendingEmail(false);

      if (error && error instanceof Error) {
        UiNotificationUtils.error(notification, error.message);
      } else {
        message.success('El código ha sido enviado nuevamente');
      }
    });
  };

  return (
    <CenteredLayout>
      <Form<FormValues>
        onFinish={(values) => login(values)}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          label="Clave de acceso"
          name="token"
          rules={[{ required: true }]}
          help="Revisa tu correo electrónico"
        >
          <Input className="text-sm" placeholder="Ingresa tu clave de acceso" />
        </Form.Item>

        <div className="mb-16 text-right">
          <Button
            tooltip={{ title: 'Reenviar código' }}
            htmlType="button"
            type="text"
            onClick={() => resendEmail()}
            disabled={isSendingEmail}
            loading={isSendingEmail}
            icon={<ReloadOutlined />}
          />
        </div>

        <Space direction="horizontal" className="flex justify-between">
          <Button
            className="rounded-bl-none rounded-br-[10px] rounded-tl-[10px] rounded-tr-none"
            type="primary"
            htmlType="submit"
            disabled={isLoggingIn}
            loading={isLoggingIn}
          >
            Iniciar Sesión
          </Button>

          <Button
            className="ml-auto rounded-bl-none rounded-br-[10px] rounded-tl-[10px] rounded-tr-none"
            htmlType="button"
            type="text"
            onClick={() => navigate(AppUrl.Login)}
          >
            Atrás
          </Button>
        </Space>
      </Form>
    </CenteredLayout>
  );
};
