import React from 'react';
import { Link } from 'react-router-dom';

import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { AppUrlGenericEnum } from '@ui/app.enum';
import { Button } from '@ui/components/Button/Button';
import { AddNewIcon } from '@ui/components/Icons/AddNewIcon';
import { useIsInRole } from '@ui/hooks/auth/useIsInRole';

type Props = {
  scope: ScopeEnum;
};

export const GridNewButton: React.FC<Props> = ({ scope }) => {
  const canCreate = useIsInRole(PermissionEnum.CREATE, scope);

  return (
    canCreate && (
      <Link to={AppUrlGenericEnum.NEW}>
        <Button icon={<AddNewIcon />} htmlType="button" type="primary">
          Nuevo
        </Button>
      </Link>
    )
  );
};
