import {
  AppSettingDto,
  AppSettingKey,
  AppSettingValues,
} from '@club-social/shared/app-settings';

export class AppSettingResponseDto<
  K extends AppSettingKey,
> implements AppSettingDto<K> {
  public description: null | string;
  public key: K;
  public updatedAt: string;
  public updatedBy: null | string;
  public value: AppSettingValues[K];
}
