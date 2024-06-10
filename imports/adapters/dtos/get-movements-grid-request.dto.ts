import { IsArray, IsEnum } from 'class-validator';

import { GetGridRequestDto } from '@adapters/common/dtos/get-grid-request.dto';
import {
  MovementCategoryEnum,
  MovementStatusEnum,
} from '@domain/categories/category.enum';
import { FindPaginatedMovementsRequest } from '@domain/movements/movement.repository';

export class GetMovementsGridRequestDto
  extends GetGridRequestDto
  implements FindPaginatedMovementsRequest
{
  @IsEnum(MovementCategoryEnum, { each: true })
  @IsArray()
  public filterByCategory!: MovementCategoryEnum[];

  @IsEnum(MovementStatusEnum, { each: true })
  @IsArray()
  public filterByStatus!: MovementStatusEnum[];
}
