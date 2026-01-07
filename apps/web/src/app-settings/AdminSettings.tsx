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

export function AdminSettings({ onUpdate, settings }: Props) {
  const maintenanceMode = settings.find(
    (setting) => setting.key === AppSettingKey.MAINTENANCE_MODE,
  );

  const sendEmails = settings.find(
    (setting) => setting.key === AppSettingKey.SEND_EMAILS,
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

  return (
    <Card title="Configuración del Sistema">
      <Descriptions>
        {maintenanceMode && (
          <Descriptions.Item label="Modo de mantenimiento">
            <Checkbox
              checked={maintenanceMode.value.enabled}
              onChange={(e) =>
                onUpdate(maintenanceMode.key, { enabled: e.target.checked })
              }
            >
              {maintenanceMode.description}
            </Checkbox>
          </Descriptions.Item>
        )}
        {sendEmails && (
          <Descriptions.Item label="Enviar correos electrónicos">
            <Checkbox
              checked={sendEmails.value.enabled}
              onChange={(e) => {
                onUpdate(sendEmails.key, { enabled: e.target.checked });
              }}
            >
              {sendEmails.description}
            </Checkbox>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
}
