import { IUpdateDueDto } from '@club-social/shared/dues';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateDueDto implements IUpdateDueDto {
  @IsInt()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public amount: number;

  @IsOptional()
  @IsString()
  public notes: null | string;
}
