import React from 'react';
import { ButtonProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ui/components/Button';

type Props = ButtonProps & {
  to: string;
};

export const FormBackButton: React.FC<Props> = ({
  disabled,
  loading,
  to,
  ...rest
}) => {
  const navigate = useNavigate();

  return (
    <Button
      disabled={disabled}
      loading={loading}
      type="text"
      onClick={() => navigate(to)}
      {...rest}
    >
      Atrás
    </Button>
  );
};
