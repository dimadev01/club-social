import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="No encontrado"
      subTitle={
        <Button type="link" onClick={() => navigate(-1)}>
          Ir hacia atrás
        </Button>
      }
    />
  );
};
