import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppUrl } from '@ui/app.enum';
import { LoadingScreen } from '@ui/components/LoadingScreen';

export const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Meteor.logout(() => {
      navigate(`${AppUrl.AUTH}/${AppUrl.AUTH_LOGIN}`);
    });
  }, [navigate]);

  return <LoadingScreen />;
};
