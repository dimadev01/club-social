import { SaveOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd';
import React from 'react';

import { PermissionEnum, type ScopeEnum } from '@domain/roles/role.enum';
import { Button } from '@ui/components/Button/Button';
import { useIsInRoleFn } from '@ui/hooks/auth/useIsInRole';

export type FormSaveButtonProps = ButtonProps & {
  scope?: ScopeEnum;
  text?: string;
};

export const FormSaveButton: React.FC<FormSaveButtonProps> = ({
  scope,
  text,
  ...rest
}) => {
  const isInRole = useIsInRoleFn();

  if (scope) {
    const canCreate = isInRole(PermissionEnum.CREATE, scope);

    const canUpdate = isInRole(PermissionEnum.UPDATE, scope);

    if (!canCreate && !canUpdate) {
      return null;
    }
  }

  return (
    <Button icon={<SaveOutlined />} type="primary" htmlType="submit" {...rest}>
      {text ?? 'Guardar'}
    </Button>
  );
};
