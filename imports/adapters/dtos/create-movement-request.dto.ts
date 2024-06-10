import {
  IsDateString,
  IsDefined,
  IsEnum,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

import { IsNullable } from '@adapters/common/class-validator/is-nullable';
import { CreateMovementRequest } from '@application/movements/use-cases/create-movement/create-movement.request';
import {
  MovementCategoryEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';

export class CreateMovementRequestDto implements CreateMovementRequest {
  @IsInt()
  @IsPositive()
  @IsNumber()
  public amount!: number;

  @IsEnum(MovementCategoryEnum)
  public category!: MovementCategoryEnum;

  @IsDateString()
  public date!: string;

  @IsString()
  @IsNullable()
  @IsDefined()
  public notes!: string | null;

  @IsEnum(MovementTypeEnum)
  public type!: MovementTypeEnum;
}
