import { ArrowLeftOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd';
import React from 'react';

import { Button } from '@ui/components/Button/Button';
import { useNavigate } from '@ui/hooks/ui/useNavigate';

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
      icon={<ArrowLeftOutlined />}
      onClick={() => (to ? navigate(to) : navigate(-1))}
      disabled={false}
      {...rest}
    >
      Atrás
    </Button>
  );
};
