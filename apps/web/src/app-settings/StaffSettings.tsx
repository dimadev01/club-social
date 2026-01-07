import {
  type AppSettingDto,
  AppSettingKey,
  type AppSettingValues,
} from '@club-social/shared/app-settings';
import { Typography } from 'antd';

import { Card } from '@/ui';

interface Props {
  onUpdate: (
    key: AppSettingKey,
    value: AppSettingValues[AppSettingKey],
  ) => void;
  settings: AppSettingDto<AppSettingKey>[];
}

export function StaffSettings({ settings }: Props) {
  if (settings.length === 0) {
    return (
      <Card title="Configuración de la Aplicación">
        <Typography.Paragraph>
          No hay configuración de la aplicación para configurar
        </Typography.Paragraph>
      </Card>
    );
  }

  return (
    <Card title="Configuración de la Aplicación">
      <Typography.Paragraph>
        No hay configuración de la aplicación para configurar
      </Typography.Paragraph>
    </Card>
  );
}
