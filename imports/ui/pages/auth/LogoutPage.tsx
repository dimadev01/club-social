import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppUrl } from '@ui/app.enum';

export const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Meteor.logout(() => {
      navigate(AppUrl.Login);
    });
  }, [navigate]);

  return <>logout</>;
};
