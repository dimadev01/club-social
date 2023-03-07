import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { CategoryEnum, CategoryType } from '@domain/categories/categories.enum';

export class CreateMovementRequestDto {
  @IsDateString()
  date: string;

  @IsEnum(CategoryEnum)
  category: CategoryEnum;

  @IsEnum(CategoryType)
  type: CategoryType;

  @IsInt()
  amount: number;

  @IsString()
  @IsOptional()
  notes: string | null;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  memberIds: string[] | null;
}
