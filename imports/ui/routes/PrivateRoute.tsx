import React, { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { useIsInRole } from '@ui/hooks/auth/useIsInRole';

type Props = PropsWithChildren & {
  permission: PermissionEnum;
  scope: ScopeEnum;
};

export const OldPrivateRoute: React.FC<Props> = ({
  children,
  permission,
  scope,
}) => {
  const isInRole = useIsInRole(permission, scope);

  if (!isInRole) {
    return <Navigate to={AppUrl.HOME} />;
  }

  return children;
};
