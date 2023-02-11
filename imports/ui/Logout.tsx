import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppUrl } from '@ui/app.enum';

export const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let isLogoutTriggered = false;

    Meteor.logout((err) => {
      if (err) {
        alert(err.message);
      } else if (!isLogoutTriggered) {
        navigate(AppUrl.LOGIN);
      }
    });

    return () => {
      isLogoutTriggered = true;
    };
  }, [navigate]);

  return <>Logging out</>;
};
