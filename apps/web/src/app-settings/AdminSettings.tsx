import {
  type AppSettingDto,
  AppSettingKey,
  type AppSettingValues,
} from '@club-social/shared/app-settings';
import { Checkbox, Typography } from 'antd';

import { Card, Descriptions } from '@/ui';

interface Props {
  onUpdate: (
    key: AppSettingKey,
    value: AppSettingValues[AppSettingKey],
  ) => void;
  settings: AppSettingDto<AppSettingKey>[];
}

const APP_SETTINGS_LABELS = {
  [AppSettingKey.MAINTENANCE_MODE]: 'Modo de mantenimiento',
  [AppSettingKey.SEND_EMAILS]: 'Enviar correos electrónicos',
  [AppSettingKey.SEND_MEMBER_NOTIFICATIONS]: 'Enviar notificaciones a socios',
} as const;

export function AdminSettings({ onUpdate, settings }: Props) {
  const maintenanceMode = settings.find(
    (setting) => setting.key === AppSettingKey.MAINTENANCE_MODE,
  );

  const sendEmails = settings.find(
    (setting) => setting.key === AppSettingKey.SEND_EMAILS,
  );

  const sendMemberNotifications = settings.find(
    (setting) => setting.key === AppSettingKey.SEND_MEMBER_NOTIFICATIONS,
  );

  if (settings.length === 0) {
    return (
      <Card title="Configuración del Sistema">
        <Typography.Paragraph>
          No hay configuración del sistema para configurar
        </Typography.Paragraph>
      </Card>
    );
  }

  const renderBooleanSetting = (setting: AppSettingDto<AppSettingKey>) => {
    return (
      <Descriptions.Item
        key={setting.key}
        label={APP_SETTINGS_LABELS[setting.key]}
      >
        <Checkbox
          checked={setting.value.enabled}
          onChange={(e) => onUpdate(setting.key, { enabled: e.target.checked })}
        >
          {setting.description}
        </Checkbox>
      </Descriptions.Item>
    );
  };

  return (
    <Card title="Configuración del Sistema">
      <Descriptions>
        {maintenanceMode && renderBooleanSetting(maintenanceMode)}
        {sendEmails && renderBooleanSetting(sendEmails)}
        {sendMemberNotifications &&
          renderBooleanSetting(sendMemberNotifications)}
      </Descriptions>
    </Card>
  );
}
