import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AppUrl } from '@ui/app.enum';

type Props = {
  children: JSX.Element;
};

export const Layout: React.FC<Props> = ({ children }) => {
  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.LOGIN} />;
  }

  return (
    <div>
      <header>
        <ul>
          <li>
            <Link to={AppUrl.HOME}>Home</Link>
          </li>
          <li>
            <Link to={AppUrl.HOME}>Private</Link>
          </li>
          <li>
            <Link to={AppUrl.LOGOUT}>Logout</Link>
          </li>
        </ul>
      </header>

      <main>{children}</main>
    </div>
  );
};
