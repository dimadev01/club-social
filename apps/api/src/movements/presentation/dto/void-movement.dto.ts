import { VoidMovementDto } from '@club-social/shared/movements';
import { IsNotEmpty, IsString } from 'class-validator';

export class VoidMovementRequestDto implements VoidMovementDto {
  @IsNotEmpty()
  @IsString()
  public voidReason: string;
}
