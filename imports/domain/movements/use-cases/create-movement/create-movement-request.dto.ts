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

import {
  CategoryEnum,
  CategoryTypeEnum,
} from '@domain/categories/category.enum';

export class CreateMovementRequestDto {
  @IsDateString()
  date: string;

  @IsEnum(CategoryEnum)
  category: CategoryEnum;

  @IsEnum(CategoryTypeEnum)
  type: CategoryTypeEnum;

  @IsInt()
  @IsPositive()
  amount: number;

  @IsString()
  @IsOptional()
  notes: string | null;

  @IsOptional()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  memberIds: string[] | null;

  @IsOptional()
  @IsString()
  professorId: string | null;

  @IsOptional()
  @IsString()
  serviceId: string | null;

  @IsOptional()
  @IsString()
  employeeId: string | null;
}
