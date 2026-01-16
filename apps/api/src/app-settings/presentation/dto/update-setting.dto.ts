import { AppSettingKey } from '@club-social/shared/app-settings';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateSettingKeyDto {
  @IsEnum(AppSettingKey)
  public key: AppSettingKey;
}

export class UpdateSettingRequestDto {
  @IsNotEmpty()
  public value: unknown;
}
