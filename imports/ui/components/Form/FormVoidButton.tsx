import { StopOutlined } from '@ant-design/icons';
import { ButtonProps, Popconfirm } from 'antd';
import React from 'react';

import { PermissionEnum, type ScopeEnum } from '@domain/roles/role.enum';
import { SecurityUtils } from '@infra/security/security.utils';
import { Button } from '@ui/components/Button';

export type FormDeleteButtonProps = ButtonProps & {
  onClick: () => void;
  scope: ScopeEnum;
};

export const FormVoidButton: React.FC<FormDeleteButtonProps> = ({
  onClick,
  scope,
  ...rest
}) => {
  if (!SecurityUtils.isInRole(PermissionEnum.VOID, scope)) {
    return false;
  }

  return (
    <Popconfirm title="¿Confirma la acción?" onConfirm={() => onClick()}>
      <Button icon={<StopOutlined />} danger {...rest}>
        Anular
      </Button>
    </Popconfirm>
  );
};
