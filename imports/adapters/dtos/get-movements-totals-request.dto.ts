import { IsArray, IsEnum, IsString } from 'class-validator';

import {
  MovementCategoryEnum,
  MovementStatusEnum,
} from '@domain/categories/category.enum';
import { FindPaginatedMovementsFilters } from '@domain/movements/movement.repository';

export class GetMovementsTotalsRequestDto
  implements FindPaginatedMovementsFilters
{
  @IsEnum(MovementCategoryEnum, { each: true })
  @IsArray()
  public filterByCategory!: MovementCategoryEnum[];

  @IsString({ each: true })
  @IsArray()
  public filterByCreatedAt!: string[];

  @IsString({ each: true })
  @IsArray()
  public filterByDate!: string[];

  @IsEnum(MovementStatusEnum, { each: true })
  @IsArray()
  public filterByStatus!: MovementStatusEnum[];
}
