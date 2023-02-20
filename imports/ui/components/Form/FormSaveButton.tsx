import React from 'react';
import { ButtonProps } from 'antd';
import { Button } from '@ui/components/Button';

type Props = ButtonProps;

export const FormSaveButton: React.FC<Props> = ({
  loading,
  disabled,
  ...rest
}) => (
  <Button
    type="primary"
    disabled={disabled}
    loading={loading}
    htmlType="submit"
    {...rest}
  >
    Guardar
  </Button>
);
