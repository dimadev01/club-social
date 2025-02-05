import { Button, Result } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const InternalError = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="500"
      title="Error inesperado"
      subTitle={<Button onClick={() => navigate(-1)}>Ir hacia atrás</Button>}
    />
  );
};
