import { ButtonProps } from 'antd';
import React from 'react';

import { Button } from '@ui/components/Button';
import { useNavigate } from '@ui/hooks/useNavigate';

export type FormBackButtonProps = ButtonProps & {
  to?: string;
};

export const FormBackButton: React.FC<FormBackButtonProps> = ({
  to,
  ...rest
}) => {
  const navigate = useNavigate();

  return (
    <Button onClick={() => (to ? navigate(to) : navigate(-1))} {...rest}>
      Atrás
    </Button>
  );
};
