import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppUrl } from '@ui/app.enum';

export const Login = () => {
  const navigate = useNavigate();

  return (
    <>
      Login
      <button
        type="button"
        onClick={() =>
          Meteor.loginWithPassword(
            'info@clubsocialmontegrande.ar',
            '3214',
            (err) => {
              if (err) {
                alert(err.message);
              } else {
                navigate(AppUrl.HOME);
              }
            }
          )
        }
      >
        Login
      </button>
    </>
  );
};
