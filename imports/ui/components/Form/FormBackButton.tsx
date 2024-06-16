import { ButtonProps } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@ui/components/Button/Button';
import { BackIcon } from '@ui/components/Icons/BackIcon';

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
      icon={<BackIcon />}
      onClick={() => (to ? navigate(to) : navigate(-1))}
      disabled={false}
      type="text"
      htmlType="button"
      {...rest}
    >
      Atrás
    </Button>
  );
};
