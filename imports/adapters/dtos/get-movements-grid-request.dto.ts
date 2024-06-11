import { IsArray, IsEnum, IsString } from 'class-validator';

import { GetGridRequestDto } from '@adapters/common/dtos/get-grid-request.dto';
import {
  MovementCategoryEnum,
  MovementStatusEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';
import { FindPaginatedMovementsRequest } from '@domain/movements/movement.repository';

export class GetMovementsGridRequestDto
  extends GetGridRequestDto
  implements FindPaginatedMovementsRequest
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

  @IsEnum(MovementTypeEnum, { each: true })
  @IsArray()
  public filterByType!: MovementTypeEnum[];
}
