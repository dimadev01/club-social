import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { IsNullable } from '@shared/class-validator/is-nullable';

export class UpdateDueRequestDto {
  @IsInt()
  @IsPositive()
  public amount: number;

  @IsEnum(DueCategoryEnum)
  public category: DueCategoryEnum;

  @IsDateString()
  public date: string;

  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsNotEmpty()
  @IsString()
  public memberId: string;

  @IsString()
  @IsNullable()
  public notes: string | null;
}
