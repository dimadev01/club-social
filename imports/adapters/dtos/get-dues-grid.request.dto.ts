import { IsArray, IsEnum, IsString } from 'class-validator';

import { GetGridRequestDto } from '@adapters/common/dtos/get-grid-request.dto';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { FindPaginatedDuesRequest } from '@domain/dues/due.repository';

export class GetDuesGridRequestDto
  extends GetGridRequestDto
  implements FindPaginatedDuesRequest
{
  @IsEnum(DueCategoryEnum, { each: true })
  @IsArray()
  public filterByCategory!: DueCategoryEnum[];

  @IsString({ each: true })
  @IsArray()
  public filterByMember!: string[];

  @IsEnum(DueStatusEnum, { each: true })
  @IsArray()
  public filterByStatus!: DueStatusEnum[];
}
