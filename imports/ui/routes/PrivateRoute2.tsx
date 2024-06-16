import React from 'react';
import { Navigate } from 'react-router-dom';

import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { useIsInRole } from '@ui/hooks/auth/useIsInRole';

type Props = {
  element: React.ReactNode;
  permission: PermissionEnum;
  scope: ScopeEnum;
};

export const PrivateRoute: React.FC<Props> = ({
  permission,
  scope,
  element,
}) => {
  const isInRole = useIsInRole(permission, scope);

  if (!isInRole) {
    return <Navigate to={AppUrl.HOME} />;
  }

  return element;
};
