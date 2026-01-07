import {
  type AppSettingDto,
  AppSettingKey,
  AppSettingScope,
  type AppSettingValues,
} from '@club-social/shared/app-settings';
import { UserRole } from '@club-social/shared/users';
import { useQueryClient } from '@tanstack/react-query';
import { Space } from 'antd';
import { useMemo } from 'react';

import { useSessionUser } from '@/auth/useUser';
import { queryKeys } from '@/shared/lib/query-keys';
import { Card, Page } from '@/ui';
import { NotFound } from '@/ui/NotFound';

import { AdminSettings } from './AdminSettings';
import { StaffSettings } from './StaffSettings';
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

  const { appScopeSettings, systemSettings } = useMemo(
    () => ({
      appScopeSettings: (appSettings ?? []).filter(
        (setting) => setting.scope === AppSettingScope.APP,
      ),
      systemSettings: (appSettings ?? []).filter(
        (setting) => setting.scope === AppSettingScope.SYSTEM,
      ),
    }),
    [appSettings],
  );

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
          <AdminSettings onUpdate={onUpdate} settings={systemSettings} />
        )}

        {(isAdmin || isStaff) && (
          <StaffSettings onUpdate={onUpdate} settings={appScopeSettings} />
        )}
      </Space>
    </Page>
  );
}
