import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsPositive,
  IsString,
} from 'class-validator';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { IsNullable } from '@shared/class-validator/is-nullable';

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
  @IsNullable()
  public notes: string | null;
}
