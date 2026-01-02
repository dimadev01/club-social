import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateMaintenanceModeDto {
  @ApiProperty({
    description: 'Whether maintenance mode should be enabled',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  public enabled: boolean;
}
