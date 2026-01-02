export const AppSettingKey = {
  MAINTENANCE_MODE: 'maintenance-mode',
} as const;

export type AppSettingKey = (typeof AppSettingKey)[keyof typeof AppSettingKey];

export interface AppSettingValues {
  [AppSettingKey.MAINTENANCE_MODE]: MaintenanceModeValue;
}

export interface MaintenanceModeValue {
  enabled: boolean;
}
