import { UpdateDueDto } from '@club-social/shared/dues';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateDueRequestDto implements UpdateDueDto {
  @IsInt()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public amount: number;

  @IsOptional()
  @IsString()
  public notes: null | string;
}
