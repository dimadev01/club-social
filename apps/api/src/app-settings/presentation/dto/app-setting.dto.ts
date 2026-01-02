export class AppSettingDto {
  public description: null | string;
  public key: string;
  public updatedAt: Date;
  public updatedBy: null | string;
  public value: unknown;
}

export class MaintenanceModeDto {
  public enabled: boolean;
}
