import { ButtonProps } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { PermissionEnum, type ScopeEnum } from '@domain/roles/role.enum';
import { AppUrlGenericEnum } from '@ui/app.enum';
import { Button } from '@ui/components/Button/Button';
import { EditIcon } from '@ui/components/Icons/EditIcon';
import { useIsInRoleFn } from '@ui/hooks/auth/useIsInRole';

export type FormEditButtonProps = ButtonProps & {
  scope: ScopeEnum;
  text?: string;
};

export const FormEditButton: React.FC<FormEditButtonProps> = ({
  scope,
  text,
  ...rest
}) => {
  const navigate = useNavigate();

  const isInRole = useIsInRoleFn();

  if (scope) {
    const canUpdate = isInRole(PermissionEnum.UPDATE, scope);

    if (!canUpdate) {
      return null;
    }
  }

  return (
    <Button
      onClick={() => navigate(AppUrlGenericEnum.EDIT)}
      icon={<EditIcon />}
      type="primary"
      htmlType="button"
      {...rest}
    >
      Editar
    </Button>
  );
};
