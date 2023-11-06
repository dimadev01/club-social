import React from 'react';
import { Roles } from 'meteor/alanning:roles';
import { useTracker } from 'meteor/react-meteor-data';
import { Navigate } from 'react-router-dom';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { AuthRoute } from '@ui/Routes/AuthRoute';

type Props = {
  children: JSX.Element;
  permission: PermissionEnum;
  scope: ScopeEnum;
};

export const PrivateRoute: React.FC<Props> = ({
  children,
  permission,
  scope,
}) => {
  const { user } = useTracker(() => ({ user: Meteor.user() }));

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  if (!Roles.userIsInRole(user, permission, scope)) {
    return <Navigate to={AppUrl.Home} />;
  }

  return <AuthRoute>{children}</AuthRoute>;
};
