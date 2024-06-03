import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

import { GetGridRequestDto } from '@adapters/common/dtos/get-grid-request.dto';
import { GetDuesGridRequest } from '@application/dues/use-cases/get-dues-grid/get-dues-grid.request';
import { DueStatusEnum } from '@domain/dues/due.enum';

export class GetDuesGridRequestDto
  extends GetGridRequestDto
  implements GetDuesGridRequest
{
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  filterByMember: string[] | undefined;

  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  filterByStatus: DueStatusEnum[] | undefined;
}
