import { IsArray, IsString } from 'class-validator';

import { GetGridRequestDto } from '@adapters/common/dtos/get-grid-request.dto';
import { DueStatusEnum } from '@domain/dues/due.enum';
import { FindPaginatedDuesRequest } from '@domain/dues/due.repository';

export class GetDuesGridRequestDto
  extends GetGridRequestDto
  implements FindPaginatedDuesRequest
{
  @IsString({ each: true })
  @IsArray()
  public filterByMember!: string[];

  @IsString({ each: true })
  @IsArray()
  public filterByStatus!: DueStatusEnum[];
}
