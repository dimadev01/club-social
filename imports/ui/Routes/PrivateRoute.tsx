import React from 'react';
import { Roles } from 'meteor/alanning:roles';
import { Navigate } from 'react-router-dom';
import { Permission, Scope } from '@domain/roles/roles.enum';
import { AppUrl } from '@ui/app.enum';
import { AuthRoute } from '@ui/Routes/AuthRoute';

type Props = {
  children: JSX.Element;
  permission: Permission;
  scope: Scope;
};

export const PrivateRoute: React.FC<Props> = ({
  children,
  permission,
  scope,
}) => {
  const user = Meteor.user();

  console.log(user);

  if (!user) {
    return <Navigate to={AppUrl.LOGIN} />;
  }

  if (!Roles.userIsInRole(user, permission as string, scope)) {
    alert('Not authorized');

    return <Navigate to={AppUrl.LOGOUT} />;
  }

  return <AuthRoute>{children}</AuthRoute>;
};
