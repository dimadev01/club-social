import {
  APP_SETTINGS_LABELS,
  type AppSettingDto,
  AppSettingKey,
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

  if (!isAdmin && !isStaff) {
    return <NotFound />;
  }

  if (isLoading) {
    return <Card loading />;
  }

  const maintenanceModeSetting = appSettings?.find(
    (
      setting,
    ): setting is AppSettingDto<typeof AppSettingKey.MAINTENANCE_MODE> =>
      setting.key === AppSettingKey.MAINTENANCE_MODE,
  );

  const sendEmailsSetting = appSettings?.find(
    (setting): setting is AppSettingDto<typeof AppSettingKey.SEND_EMAILS> =>
      setting.key === AppSettingKey.SEND_EMAILS,
  );

  const sendMemberNotificationsSetting = appSettings?.find(
    (
      setting,
    ): setting is AppSettingDto<typeof AppSettingKey.SEND_NOTIFICATIONS> =>
      setting.key === AppSettingKey.SEND_NOTIFICATIONS,
  );

  return (
    <Page>
      <Space className="flex" vertical>
        {isAdmin && (
          <Card title="Configuración del Sistema">
            <Descriptions
              items={[
                {
                  children: (
                    <Checkbox
                      checked={maintenanceModeSetting?.value.enabled}
                      onChange={(e) =>
                        onUpdate(AppSettingKey.MAINTENANCE_MODE, {
                          enabled: e.target.checked,
                        })
                      }
                    >
                      {maintenanceModeSetting?.description}
                    </Checkbox>
                  ),
                  key: AppSettingKey.MAINTENANCE_MODE,
                  label: APP_SETTINGS_LABELS[AppSettingKey.MAINTENANCE_MODE],
                },
                {
                  children: (
                    <Checkbox
                      checked={sendEmailsSetting?.value.enabled}
                      onChange={(e) =>
                        onUpdate(AppSettingKey.SEND_EMAILS, {
                          enabled: e.target.checked,
                        })
                      }
                    >
                      {sendEmailsSetting?.description}
                    </Checkbox>
                  ),
                  key: AppSettingKey.SEND_EMAILS,
                  label: APP_SETTINGS_LABELS[AppSettingKey.SEND_EMAILS],
                },
              ]}
              styles={{ label: { width: 250 } }}
            />
          </Card>
        )}

        {(isAdmin || isStaff) && (
          <Card title="Configuración de la Aplicación">
            <Descriptions
              items={[
                {
                  children: (
                    <Checkbox
                      checked={sendMemberNotificationsSetting?.value.enabled}
                      onChange={(e) =>
                        onUpdate(AppSettingKey.SEND_NOTIFICATIONS, {
                          enabled: e.target.checked,
                        })
                      }
                    >
                      {sendMemberNotificationsSetting?.description}
                    </Checkbox>
                  ),
                  key: AppSettingKey.SEND_NOTIFICATIONS,
                  label: APP_SETTINGS_LABELS[AppSettingKey.SEND_NOTIFICATIONS],
                },
              ]}
              styles={{ label: { width: 250 } }}
            />
          </Card>
        )}
      </Space>
    </Page>
  );
}
