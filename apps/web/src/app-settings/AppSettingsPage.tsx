import { AppSettingKey } from '@club-social/shared/app-settings';
import { UserRole } from '@club-social/shared/users';
import { Checkbox } from 'antd';

import { useSessionUser } from '@/auth/useUser';
import { Card, Form, Page } from '@/ui';
import { NotFound } from '@/ui/NotFound';

import { useAppSetting } from './useAppSetting';
import { useUpdateAppSetting } from './useUpdateAppSetting';

export function AppSettingsPage() {
  const { role } = useSessionUser();
  const isAdmin = role === UserRole.ADMIN;

  const {
    data: maintenanceMode,
    isLoading: isLoadingMaintenanceMode,
    refetch: refetchMaintenanceMode,
  } = useAppSetting(AppSettingKey.MAINTENANCE_MODE);
  const updateMutation = useUpdateAppSetting();

  const handleMaintenanceModeChange = (checked: boolean) => {
    updateMutation.mutate(
      {
        key: AppSettingKey.MAINTENANCE_MODE,
        value: { enabled: checked },
      },
      {
        onSuccess: () => {
          refetchMaintenanceMode();
        },
      },
    );
  };

  if (!isAdmin) {
    return <NotFound />;
  }

  const isLoadingQuery = isLoadingMaintenanceMode;
  const isMaintenanceEnabled = maintenanceMode?.value.enabled ?? false;

  return (
    <Page>
      <Card loading={isLoadingQuery} title="Sistema">
        <Form layout="horizontal">
          <Form.Item
            help={maintenanceMode?.description}
            label="Maintenance mode"
            name="maintenanceMode"
          >
            <Checkbox
              checked={isMaintenanceEnabled}
              disabled={updateMutation.isPending}
              onChange={(e) => handleMaintenanceModeChange(e.target.checked)}
            />
          </Form.Item>
        </Form>
      </Card>
    </Page>
  );
}
