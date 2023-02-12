import React, { useEffect } from 'react';
import { message } from 'antd';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AppUrl } from '@ui/app.enum';

export const VerifyEmailPage = () => {
  const navigate = useNavigate();

  const { token } = useParams<{ email?: string; token?: string }>();

  useEffect(() => {
    let isVerifying = false;

    if (token) {
      Accounts.verifyEmail(token, (error) => {
        if (error) {
          if (!isVerifying) {
            message.error(error.message);
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
  }, [token, navigate]);

  if (!token) {
    return <Navigate to={AppUrl.Home} />;
  }

  return <>...</>;
};
