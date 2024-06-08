import React, { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { useIsInRole } from '@ui/hooks/auth/useIsInRole';
import { AuthRoute } from '@ui/routes/AuthRoute';

type Props = PropsWithChildren & {
  permission: PermissionEnum;
  scope: ScopeEnum;
};

export const PrivateRoute: React.FC<Props> = ({
  children,
  permission,
  scope,
}) => {
  const isInRole = useIsInRole();

  return (
    <AuthRoute>
      {(() => {
        if (!isInRole(permission, scope)) {
          return <Navigate to={AppUrl.Home} />;
        }

        return children;
      })()}
    </AuthRoute>
  );
};
