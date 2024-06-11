import { EditOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { PermissionEnum, type ScopeEnum } from '@domain/roles/role.enum';
import { Button } from '@ui/components/Button/Button';
import { useIsInRoleFn } from '@ui/hooks/auth/useIsInRole';
import { useNavigate } from '@ui/hooks/ui/useNavigate';

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

  const location = useLocation();

  const isInRole = useIsInRoleFn();

  if (scope) {
    const canUpdate = isInRole(PermissionEnum.UPDATE, scope);

    if (!canUpdate) {
      return null;
    }
  }

  return (
    <Button
      onClick={() => navigate(`${location.pathname}/edit`)}
      icon={<EditOutlined />}
      type="primary"
      htmlType="button"
      {...rest}
    >
      Editar
    </Button>
  );
};
