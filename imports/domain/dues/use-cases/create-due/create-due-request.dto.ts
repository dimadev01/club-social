import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { DueCategoryEnum } from '@domain/dues/due.enum';

export class CreateDueRequestDto {
  @IsInt()
  @IsPositive()
  public amount: number;

  @IsEnum(DueCategoryEnum)
  public category: DueCategoryEnum;

  @IsDateString()
  public date: string;

  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  public memberIds: string[];

  @IsString()
  @IsOptional()
  public notes: string | null;
}
