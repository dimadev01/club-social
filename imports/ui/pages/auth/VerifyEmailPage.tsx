import { App } from 'antd';
import React, { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { AppUrl } from '@ui/app.enum';
import { UiNotificationUtils } from '@ui/utils/messages.utils';

export const VerifyEmailPage = () => {
  const navigate = useNavigate();

  const { message, notification } = App.useApp();

  const { token } = useParams<{ email?: string; token?: string }>();

  useEffect(() => {
    let isVerifying = false;

    if (token) {
      Accounts.verifyEmail(token, (error) => {
        if (error) {
          if (!isVerifying) {
            UiNotificationUtils.error(notification, error.message);
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
  }, [token, navigate, message, notification]);

  if (!token) {
    return <Navigate to={AppUrl.Home} />;
  }

  return <>...</>;
};
