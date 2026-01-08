export const AppSettingKey = {
  MAINTENANCE_MODE: 'maintenance-mode',
  SEND_EMAILS: 'send-emails',
  SEND_MEMBER_NOTIFICATIONS: 'send-member-notifications',
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
  AppSettingKey.SEND_MEMBER_NOTIFICATIONS,
] as const;

export const APP_SETTING_KEYS: readonly AppSettingKey[] = [] as const;

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
  [AppSettingKey.SEND_MEMBER_NOTIFICATIONS]: SendMemberNotificationsValue;
}

export interface MaintenanceModeValue {
  enabled: boolean;
}

export interface SendEmailsValue {
  enabled: boolean;
}

export interface SendMemberNotificationsValue {
  enabled: boolean;
}

export interface UpdateAppSettingDto<K extends AppSettingKey = AppSettingKey> {
  value: AppSettingValues[K];
}
