import {
  APP_SETTINGS_LABELS,
  type AppSettingDto,
  AppSettingKey,
  AppSettingScope,
  type AppSettingValues,
} from '@club-social/shared/app-settings';
import { UserRole } from '@club-social/shared/users';
import { useQueryClient } from '@tanstack/react-query';
import { Checkbox, Space } from 'antd';

import { useSessionUser } from '@/auth/useUser';
import { queryKeys } from '@/shared/lib/query-keys';
import { Card, Descriptions, Page } from '@/ui';
import { NotFound } from '@/ui/NotFound';

import { useAppSettings } from './useAppSettings';
import { useUpdateAppSetting } from './useUpdateAppSetting';

export function AppSettingsPage() {
  const queryClient = useQueryClient();

  const { role } = useSessionUser();
  const isAdmin = role === UserRole.ADMIN;
  const isStaff = role === UserRole.STAFF;

  const { data: appSettings, isLoading } = useAppSettings();
  const updateMutation = useUpdateAppSetting();

  const appScopeSettings = (appSettings ?? []).filter(
    (setting) => setting.scope === AppSettingScope.APP,
  );
  const systemScopeSettings = (appSettings ?? []).filter(
    (setting) => setting.scope === AppSettingScope.SYSTEM,
  );

  const onUpdate = (
    key: AppSettingKey,
    value: AppSettingValues[AppSettingKey],
  ) => {
    updateMutation.mutate(
      { key, value },
      {
        onSuccess: () => {
          queryClient.setQueryData<AppSettingDto[]>(
            queryKeys.appSettings.all.queryKey,
            (old) =>
              old?.map((setting) => {
                if (setting.key === key) {
                  return { ...setting, value };
                }

                return setting;
              }),
          );
        },
      },
    );
  };

  const getBooleanSettings = (settings: AppSettingDto[]) =>
    settings.filter((setting) => {
      const keys = Object.keys(setting.value);

      if (keys.length !== 1) {
        return false;
      }

      const [firstKey] = keys;
      const value = setting.value[firstKey as keyof typeof setting.value];

      return typeof value === 'boolean';
    });

  const getBooleanItems = (settings: AppSettingDto[]) =>
    getBooleanSettings(settings).map((setting) => ({
      children: (
        <Checkbox
          checked={setting.value.enabled}
          onChange={(e) => onUpdate(setting.key, { enabled: e.target.checked })}
        >
          {setting.description}
        </Checkbox>
      ),
      key: setting.key,
      label: APP_SETTINGS_LABELS[setting.key],
    }));

  if (!isAdmin && !isStaff) {
    return <NotFound />;
  }

  if (isLoading) {
    return <Card loading />;
  }

  return (
    <Page>
      <Space className="flex" vertical>
        {isAdmin && (
          <Card title="Configuración del Sistema">
            <Descriptions items={[...getBooleanItems(systemScopeSettings)]} />
          </Card>
        )}

        {(isAdmin || isStaff) && (
          <Card title="Configuración de la Aplicación">
            <Descriptions items={[...getBooleanItems(appScopeSettings)]} />
          </Card>
        )}
      </Space>
    </Page>
  );
}
