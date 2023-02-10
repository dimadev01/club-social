import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppUrl } from '@ui/app.enum';

export const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Meteor.logout((err) => {
      if (err) {
        alert(err.message);
      } else {
        navigate(AppUrl.LOGIN);
      }
    });
  }, [navigate]);

  return <>Logging out</>;
};
