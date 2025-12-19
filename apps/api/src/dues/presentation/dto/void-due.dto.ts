import { VoidDueDto } from '@club-social/shared/dues';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class VoidDueRequestDto implements VoidDueDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @MinLength(3)
  public voidReason: string;
}
