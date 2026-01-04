import { Result } from 'antd';
import { Link } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { Button, CenteredLayout } from '@/ui';

export function MaintenancePage() {
  return (
    <CenteredLayout>
      <Result
        extra={
          <Link to={appRoutes.auth.logout}>
            <Button type="primary">Cerrar sesión</Button>
          </Link>
        }
        status="warning"
        subTitle="Estamos realizando mejoras en el sistema. Por favor, intente nuevamente más tarde."
        title="Sistema en Mantenimiento"
      />
    </CenteredLayout>
  );
}
