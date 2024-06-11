import { DeleteOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd';
import React from 'react';

import { PermissionEnum, type ScopeEnum } from '@domain/roles/role.enum';
import { Button } from '@ui/components/Button/Button';
import { Popconfirm } from '@ui/components/Popconfirm/Popconfirm';
import { useIsInRole } from '@ui/hooks/auth/useIsInRole';

export type FormDeleteButtonProps = ButtonProps & {
  onClick: () => void;
  scope: ScopeEnum;
};

export const FormDeleteButton: React.FC<FormDeleteButtonProps> = ({
  onClick,
  scope,
  ...rest
}) => {
  const canDelete = useIsInRole(PermissionEnum.DELETE, scope);

  return (
    canDelete && (
      <Popconfirm title="¿Confirma la acción?" onConfirm={() => onClick()}>
        <Button icon={<DeleteOutlined />} danger {...rest}>
          Eliminar
        </Button>
      </Popconfirm>
    )
  );
};
