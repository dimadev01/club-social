import { Result } from 'antd';

import { CenteredLayout } from '@/ui';

export function MaintenancePage() {
  return (
    <CenteredLayout>
      <Result
        status="warning"
        subTitle="Estamos realizando mejoras en el sistema. Por favor, intente nuevamente más tarde."
        title="Sistema en Mantenimiento"
      />
    </CenteredLayout>
  );
}
