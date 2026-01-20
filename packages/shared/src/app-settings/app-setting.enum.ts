export const AppSettingKey = {
  MAINTENANCE_MODE: 'maintenance-mode',
  SEND_EMAILS: 'send-emails',
  SEND_NOTIFICATIONS: 'send-notifications',
} as const;

export type AppSettingKey = (typeof AppSettingKey)[keyof typeof AppSettingKey];

export const AppSettingScope = {
  APP: 'app',
  SYSTEM: 'system',
} as const;

export type AppSettingScope =
  (typeof AppSettingScope)[keyof typeof AppSettingScope];

export const SYSTEM_SETTING_KEYS: readonly AppSettingKey[] = [
  AppSettingKey.MAINTENANCE_MODE,
  AppSettingKey.SEND_EMAILS,
] as const;

export const APP_SETTING_KEYS: readonly AppSettingKey[] = [
  AppSettingKey.SEND_NOTIFICATIONS,
] as const;

export interface AppSettingDto<K extends AppSettingKey = AppSettingKey> {
  description: null | string;
  key: K;
  scope: AppSettingScope;
  updatedAt: string;
  updatedBy: null | string;
  value: AppSettingValues[K];
}

export interface AppSettingValues {
  [AppSettingKey.MAINTENANCE_MODE]: MaintenanceModeValue;
  [AppSettingKey.SEND_EMAILS]: SendEmailsValue;
  [AppSettingKey.SEND_NOTIFICATIONS]: SendNotificationsValue;
}

export type BooleanAppSettingKey =
  | typeof AppSettingKey.MAINTENANCE_MODE
  | typeof AppSettingKey.SEND_EMAILS
  | typeof AppSettingKey.SEND_NOTIFICATIONS;

export interface MaintenanceModeValue {
  enabled: boolean;
}

export interface SendEmailsValue {
  enabled: boolean;
}

export interface SendNotificationsValue {
  enabled: boolean;
}

export interface UpdateAppSettingDto<K extends AppSettingKey = AppSettingKey> {
  value: AppSettingValues[K];
}

export function isBooleanAppSetting(
  setting: AppSettingDto,
): setting is AppSettingDto<BooleanAppSettingKey> {
  return (
    setting.key === AppSettingKey.MAINTENANCE_MODE ||
    setting.key === AppSettingKey.SEND_EMAILS ||
    setting.key === AppSettingKey.SEND_NOTIFICATIONS
  );
}

export const APP_SETTINGS_LABELS = {
  [AppSettingKey.MAINTENANCE_MODE]: 'Modo de mantenimiento',
  [AppSettingKey.SEND_EMAILS]: 'Enviar correos electrónicos',
  [AppSettingKey.SEND_NOTIFICATIONS]: 'Enviar notificaciones',
} as const;
