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
import { CategoryEnum, CategoryType } from '@domain/categories/categories.enum';

export class CreateMovementRequestDto {
  @IsDateString()
  date: string;

  @IsEnum(CategoryEnum)
  category: CategoryEnum;

  @IsEnum(CategoryType)
  type: CategoryType;

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

  @IsOptional()
  @IsString()
  rentalId: string | null;
}
