import { App } from 'antd';
import React, { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { AppUrl } from '@adapters/ui/app.enum';
import { useNotificationError } from '@adapters/ui/hooks/useNotification';

export const VerifyEmailPage = () => {
  const navigate = useNavigate();

  const notificationError = useNotificationError();

  const { message } = App.useApp();

  const { token } = useParams<{ email?: string; token?: string }>();

  useEffect(() => {
    let isVerifying = false;

    if (token) {
      Accounts.verifyEmail(token, (error) => {
        if (error) {
          if (!isVerifying) {
            notificationError({ message: error.message });
          }
        } else {
          message.success('Email verificado');

          navigate(AppUrl.Home);
        }
      });
    }

    return () => {
      isVerifying = true;
    };
  }, [token, navigate, message, notificationError]);

  if (!token) {
    return <Navigate to={AppUrl.Home} />;
  }

  return <>...</>;
};
