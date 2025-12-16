import { DueCategory, UpdateDueDto } from '@club-social/shared/dues';
import {
  IsDateString,
  IsEnum,
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

  @IsEnum(DueCategory)
  @IsNotEmpty()
  public category: DueCategory;

  @IsDateString()
  @IsNotEmpty()
  public date: string;

  @IsOptional()
  @IsString()
  public notes: null | string;
}
