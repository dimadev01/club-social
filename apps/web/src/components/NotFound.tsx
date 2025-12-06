import { Button, Result } from 'antd';
import { useNavigate } from 'react-router';

import { CenteredLayout } from './CenteredLayout';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <CenteredLayout>
      <Result
        extra={
          <Button onClick={() => navigate(-1)} size="large" type="primary">
            Volver
          </Button>
        }
        status="404"
        title="Página no encontrada"
      />
    </CenteredLayout>
  );
}
