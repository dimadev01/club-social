import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { Link } from 'react-router-dom';

import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { Button } from '@ui/components/Button';
import { useIsInRole } from '@ui/hooks/auth/useIsInRole';

type Props = {
  scope: ScopeEnum;
  to: string;
};

export const GridNewButton: React.FC<Props> = ({ to, scope }) => {
  const canCreate = useIsInRole(PermissionEnum.CREATE, scope);

  return (
    canCreate && (
      <Link to={to}>
        <Button
          icon={<PlusOutlined />}
          htmlType="button"
          type="primary"
          tooltip={{ title: 'Nuevo' }}
        >
          Nuevo
        </Button>
      </Link>
    )
  );
};
