import { IsArray, IsEnum, IsString } from 'class-validator';

import { FindPaginatedMovementsRequest } from '@application/movements/repositories/movement.repository';
import {
  MovementCategoryEnum,
  MovementStatusEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';
import { GetGridRequestDto } from '@ui/common/dtos/get-grid-request.dto';

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
