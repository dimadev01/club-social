import { IVoidMovementDto } from '@club-social/shared/movements';
import { IsNotEmpty, IsString } from 'class-validator';

export class VoidMovementRequestDto implements IVoidMovementDto {
  @IsNotEmpty()
  @IsString()
  public voidReason: string;
}
