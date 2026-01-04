export const AppSettingKey = {
  MAINTENANCE_MODE: 'maintenance-mode',
} as const;

export interface AppSettingDto<K extends AppSettingKey = AppSettingKey> {
  description: null | string;
  key: K;
  updatedAt: string;
  updatedBy: null | string;
  value: AppSettingValues[K];
}

export type AppSettingKey = (typeof AppSettingKey)[keyof typeof AppSettingKey];

export interface AppSettingValues {
  [AppSettingKey.MAINTENANCE_MODE]: MaintenanceModeValue;
}

export interface MaintenanceModeValue {
  enabled: boolean;
}

export interface SendEmailsValue {
  enabled: boolean;
}

export interface UpdateAppSettingDto<K extends AppSettingKey = AppSettingKey> {
  value: AppSettingValues[K];
}
