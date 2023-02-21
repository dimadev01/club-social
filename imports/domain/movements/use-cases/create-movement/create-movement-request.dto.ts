import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MovementCategory } from '@domain/movements/movements.enum';

export class CreateMovementRequestDto {
  @IsDateString()
  date: string;

  @IsEnum(MovementCategory)
  category: MovementCategory;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  notes: string | null;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  memberIds: string[] | null;
}
