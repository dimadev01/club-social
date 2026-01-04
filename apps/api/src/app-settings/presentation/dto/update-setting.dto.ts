import { IsNotEmpty, IsObject } from 'class-validator';

export class UpdateSettingRequestDto {
  @IsNotEmpty()
  @IsObject()
  public value: Record<string, unknown>;
}
