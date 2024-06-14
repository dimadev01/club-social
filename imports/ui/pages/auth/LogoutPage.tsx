import React, { useEffect } from 'react';

import { AppUrl } from '@ui/app.enum';
import { LoadingScreen } from '@ui/components/LoadingScreen';
import { useNavigate } from '@ui/hooks/ui/useNavigate';

export const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Meteor.logout(() => {
      navigate(AppUrl.LOGIN);
    });
  }, [navigate]);

  return <LoadingScreen />;
};
