import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { Link } from 'react-router-dom';

import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { SecurityUtils } from '@infra/security/security.utils';
import { Button } from '@ui/components/Button';

type Props = {
  scope: ScopeEnum;
  to: string;
};

export const GridNewButton: React.FC<Props> = ({ to, scope }) =>
  SecurityUtils.isInRole(PermissionEnum.CREATE, scope) && (
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
  );
