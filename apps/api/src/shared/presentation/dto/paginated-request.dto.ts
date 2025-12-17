import { PaginatedRequest } from '@club-social/shared/types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';

import { PaginatedRequestSortDto } from './paginated-request-sort.dto';

export class PaginatedRequestDto implements PaginatedRequest {
  @IsInt()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  public page: number;

  @IsInt()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  public pageSize: number;

  @IsArray()
  @Type(() => PaginatedRequestSortDto)
  @ValidateNested({ each: true })
  public sort: PaginatedRequestSortDto[];
}
