import {
  type AppSettingDto,
  AppSettingKey,
  AppSettingScope,
} from '@club-social/shared/app-settings';
import { UserRole } from '@club-social/shared/users';
import { Checkbox } from 'antd';
import { useMemo } from 'react';

import { useSessionUser } from '@/auth/useUser';
import { Card, Form, Page } from '@/ui';
import { NotFound } from '@/ui/NotFound';

import { useAppSettings } from './useAppSettings';
import { useUpdateAppSetting } from './useUpdateAppSetting';

const SETTING_LABELS: Record<AppSettingKey, string> = {
  [AppSettingKey.MAINTENANCE_MODE]: 'Modo de mantenimiento',
  [AppSettingKey.SEND_EMAILS]: 'Enviar correos electrónicos',
};

export function AppSettingsPage() {
  const { role } = useSessionUser();
  const isAdmin = role === UserRole.ADMIN;
  const isStaff = role === UserRole.STAFF;

  const { data: appSettings, isLoading, refetch } = useAppSettings();
  const updateMutation = useUpdateAppSetting();

  const { appScopeSettings, systemSettings } = useMemo(() => {
    const system = (appSettings ?? []).filter(
      (setting) => setting.scope === AppSettingScope.SYSTEM,
    );
    const app = (appSettings ?? []).filter(
      (setting) => setting.scope === AppSettingScope.APP,
    );

    return { appScopeSettings: app, systemSettings: system };
  }, [appSettings]);

  if (!isAdmin && !isStaff) {
    return <NotFound />;
  }

  const renderBooleanSetting = (setting: AppSettingDto<AppSettingKey>) => {
    const value = setting.value as { enabled: boolean };

    return (
      <Form.Item
        key={setting.key}
        label={SETTING_LABELS[setting.key]}
        name={setting.key}
      >
        <Checkbox
          checked={value.enabled}
          onChange={(e) => {
            updateMutation.mutate(
              { key: setting.key, value: { enabled: e.target.checked } },
              { onSuccess: () => refetch() },
            );
          }}
        >
          {setting.description}
        </Checkbox>
      </Form.Item>
    );
  };

  return (
    <Page>
      {isAdmin && systemSettings.length > 0 && (
        <Card
          className="mb-4"
          loading={isLoading}
          title="Configuración del Sistema"
        >
          <Form layout="horizontal">
            {systemSettings.map(renderBooleanSetting)}
          </Form>
        </Card>
      )}

      {appScopeSettings.length > 0 && (
        <Card loading={isLoading} title="Configuración de la Aplicación">
          <Form layout="horizontal">
            {appScopeSettings.map(renderBooleanSetting)}
          </Form>
        </Card>
      )}
    </Page>
  );
}
