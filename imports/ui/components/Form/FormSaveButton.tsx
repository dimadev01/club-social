import { ButtonProps } from 'antd';
import React from 'react';

import { PermissionEnum, type ScopeEnum } from '@domain/roles/role.enum';
import { Button } from '@ui/components/Button';

export type FormSaveButtonProps = ButtonProps & {
  scope?: ScopeEnum;
  text?: string;
};

export const FormSaveButton: React.FC<FormSaveButtonProps> = ({
  scope,
  text,
  ...rest
}) => {
  const user = Meteor.user();

  if (!user) {
    return null;
  }

  if (scope) {
    if (
      !Roles.userIsInRole(user, PermissionEnum.CREATE, scope) &&
      !Roles.userIsInRole(user, PermissionEnum.UPDATE, scope)
    ) {
      return false;
    }
  }

  return (
    <Button type="primary" htmlType="submit" {...rest}>
      {text ?? 'Guardar'}
    </Button>
  );
};
