import { SettingOutlined } from '@ant-design/icons';
import { Card, Skeleton, Space, Switch, Typography } from 'antd';

import { useMaintenanceMode } from './useMaintenanceMode';
import { useUpdateMaintenanceMode } from './useUpdateMaintenanceMode';

const { Text, Title } = Typography;

export function AppSettingsPage() {
  const { data: maintenanceMode, isLoading } = useMaintenanceMode();
  const updateMutation = useUpdateMaintenanceMode();

  const handleMaintenanceModeChange = (checked: boolean) => {
    updateMutation.mutate({ enabled: checked });
  };

  if (isLoading) {
    return (
      <Card>
        <Skeleton active />
      </Card>
    );
  }

  return (
    <Space className="w-full" direction="vertical" size="large">
      <Title level={3}>
        <SettingOutlined /> Configuración del Sistema
      </Title>

      <Card title="Modo de Mantenimiento">
        <Space direction="vertical" size="middle">
          <Space align="center">
            <Switch
              checked={maintenanceMode?.enabled ?? false}
              checkedChildren="Activado"
              loading={updateMutation.isPending}
              onChange={handleMaintenanceModeChange}
              unCheckedChildren="Desactivado"
            />
            <Text>
              {maintenanceMode?.enabled
                ? 'El sistema está en modo de mantenimiento'
                : 'El sistema está operando normalmente'}
            </Text>
          </Space>
          <Text type="secondary">
            Cuando el modo de mantenimiento está activado, solo los
            administradores pueden acceder al sistema. Los demás usuarios verán
            una página de mantenimiento.
          </Text>
        </Space>
      </Card>
    </Space>
  );
}
