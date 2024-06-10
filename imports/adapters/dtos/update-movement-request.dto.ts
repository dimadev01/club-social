import {
  IsDateString,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

import { IsNullable } from '@adapters/common/class-validator/is-nullable';
import { UpdateMovementRequest } from '@application/movements/use-cases/update-movement/update-movement.request';
import {
  MovementCategoryEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';

export class UpdateMovementRequestDto implements UpdateMovementRequest {
  @IsInt()
  @IsPositive()
  @IsNumber()
  public amount!: number;

  @IsEnum(MovementCategoryEnum)
  public category!: MovementCategoryEnum;

  @IsDateString()
  public date!: string;

  @IsNotEmpty()
  @IsString()
  public id!: string;

  @IsString()
  @IsNullable()
  @IsDefined()
  public notes!: string | null;

  @IsEnum(MovementTypeEnum)
  public type!: MovementTypeEnum;
}
