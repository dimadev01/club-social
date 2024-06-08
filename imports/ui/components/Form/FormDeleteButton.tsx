import { DeleteOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd';
import React from 'react';

import { PermissionEnum, type ScopeEnum } from '@domain/roles/role.enum';
import { SecurityUtils } from '@infra/security/security.utils';
import { Button } from '@ui/components/Button';
import { Popconfirm } from '@ui/components/Popconfirm/Popconfirm';

export type FormDeleteButtonProps = ButtonProps & {
  onClick: () => void;
  scope: ScopeEnum;
};

export const FormDeleteButton: React.FC<FormDeleteButtonProps> = ({
  onClick,
  scope,
  ...rest
}) => {
  if (!SecurityUtils.isInRole(PermissionEnum.DELETE, scope)) {
    return false;
  }

  return (
    <Popconfirm title="¿Confirma la acción?" onConfirm={() => onClick()}>
      <Button icon={<DeleteOutlined />} danger {...rest}>
        Eliminar
      </Button>
    </Popconfirm>
  );
};
