import { SettingOutlined } from '@ant-design/icons';
import { AppSettingKey } from '@club-social/shared/app-settings';
import { UserRole } from '@club-social/shared/users';
import { Space, Switch, Typography } from 'antd';

import { useSessionUser } from '@/auth/useUser';
import { Card, Page } from '@/ui';
import { NotFound } from '@/ui/NotFound';

import { useAppSetting } from './useAppSetting';
import { useUpdateAppSetting } from './useUpdateAppSetting';

export function AppSettingsPage() {
  const { role } = useSessionUser();
  const isAdmin = role === UserRole.ADMIN;

  const { data: maintenanceMode, isLoading } = useAppSetting(
    AppSettingKey.MAINTENANCE_MODE,
  );
  const updateMutation = useUpdateAppSetting();

  const handleMaintenanceModeChange = (checked: boolean) => {
    updateMutation.mutate({
      key: AppSettingKey.MAINTENANCE_MODE,
      value: { enabled: checked },
    });
  };

  if (!isAdmin) {
    return <NotFound />;
  }

  const isMaintenanceEnabled = maintenanceMode?.value.enabled ?? false;

  return (
    <Page>
      <Card extra={<SettingOutlined />} title="Configuración del Sistema">
        <Space>
          <Switch
            checked={isMaintenanceEnabled}
            checkedChildren="Activado"
            disabled={isLoading}
            loading={isLoading || updateMutation.isPending}
            onChange={handleMaintenanceModeChange}
            unCheckedChildren="Desactivado"
          />
          <Typography.Text>
            {isMaintenanceEnabled
              ? 'El sistema está en modo de mantenimiento'
              : 'El sistema está operando normalmente'}
          </Typography.Text>
        </Space>
      </Card>
    </Page>
  );
}
