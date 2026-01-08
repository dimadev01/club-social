import { AppSettingKey } from '@club-social/shared/app-settings';
import { IsEnum, IsNotEmpty, IsObject } from 'class-validator';

export class UpdateSettingKeyDto {
  @IsEnum(AppSettingKey)
  public key: AppSettingKey;
}

export class UpdateSettingRequestDto {
  @IsNotEmpty()
  @IsObject()
  public value: Record<string, unknown>;
}
