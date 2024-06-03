import React from 'react';
import { Navigate } from 'react-router-dom';

import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { SecurityUtils } from '@infra/security/security.utils';
import { AppUrl } from '@ui/app.enum';
import { AuthRoute } from '@ui/routes/AuthRoute';

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
  if (!SecurityUtils.isInRole(permission, scope)) {
    return <Navigate to={AppUrl.Home} />;
  }

  return <AuthRoute>{children}</AuthRoute>;
};
