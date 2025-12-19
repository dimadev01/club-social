import { Button, Result } from 'antd';
import { useNavigate } from 'react-router';

import { CenteredLayout } from './CenteredLayout';
import { BackIcon } from './Icons/BackIcon';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <CenteredLayout>
      <Result
        extra={
          <Button
            icon={<BackIcon />}
            onClick={() => navigate(-1)}
            size="large"
            type="default"
          >
            Volver
          </Button>
        }
        status="404"
        title="Página no encontrada"
      />
    </CenteredLayout>
  );
}
