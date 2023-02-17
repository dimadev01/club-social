import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ui/components/Button';

type Props = {
  to: string;
};

export const FormBackButton: React.FC<Props> = ({ to }) => {
  const navigate = useNavigate();

  return (
    <Button type="text" onClick={() => navigate(to)}>
      Atrás
    </Button>
  );
};
