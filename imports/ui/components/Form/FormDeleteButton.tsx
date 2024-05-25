import React from 'react';
import { ButtonProps, Popconfirm } from 'antd';
import { Button } from '@ui/components/Button';
import { PermissionEnum, type ScopeEnum } from '@domain/roles/role.enum';

export type FormDeleteButtonProps = ButtonProps & {
  onClick: () => void;
  scope: ScopeEnum;
};

export const FormDeleteButton: React.FC<FormDeleteButtonProps> = ({
  onClick,
  scope,
  ...rest
}) => {
  const user = Meteor.user();

  if (!user) {
    return null;
  }

  if (!Roles.userIsInRole(user, PermissionEnum.Delete, scope)) {
    console.log('No tiene permisos para eliminar');

    return false;
  }

  return (
    <Popconfirm title="¿Confirma la acción?" onConfirm={() => onClick()}>
      <Button danger type="dashed" {...rest}>
        Eliminar
      </Button>
    </Popconfirm>
  );
};
