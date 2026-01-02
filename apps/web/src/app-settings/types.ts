export interface AppSettingDto {
  description: null | string;
  key: string;
  updatedAt: string;
  updatedBy: null | string;
  value: unknown;
}

export interface MaintenanceModeDto {
  enabled: boolean;
}

export interface UpdateMaintenanceModeDto {
  enabled: boolean;
}
