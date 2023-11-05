import React from 'react';
import { ButtonProps, Popconfirm } from 'antd';
import { Button } from '@ui/components/Button';

type Props = ButtonProps & {
  onClick: () => void;
};

export const FormDeleteButton: React.FC<Props> = ({
  disabled,
  loading,
  onClick,
  ...rest
}) => (
  <Popconfirm title="¿Confirma la acción?" onConfirm={() => onClick()}>
    <Button
      disabled={disabled}
      loading={loading}
      danger
      type="dashed"
      {...rest}
    >
      Eliminar
    </Button>
  </Popconfirm>
);
