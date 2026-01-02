import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateMaintenanceModeRequestDto {
  @IsBoolean()
  @IsNotEmpty()
  public enabled: boolean;
}
