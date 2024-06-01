import { ButtonProps } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@adapters/ui/components/Button';

export type FormBackButtonProps = ButtonProps & {
  to?: string;
};

export const FormBackButton: React.FC<FormBackButtonProps> = ({
  to,
  ...rest
}) => {
  const navigate = useNavigate();

  return (
    <Button
      // type="text"
      // ghost
      onClick={() => (to ? navigate(to) : navigate(-1))}
      {...rest}
    >
      Atrás
    </Button>
  );
};
