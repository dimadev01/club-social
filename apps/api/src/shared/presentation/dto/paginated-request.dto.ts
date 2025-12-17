import { PaginatedRequest } from '@club-social/shared/types';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';

import { PaginatedRequestSortDto } from './paginated-request-sort.dto';

export class PaginatedRequestDto implements PaginatedRequest {
  @IsObject()
  @IsOptional()
  @Transform(({ value }) =>
    Object.entries(value).reduce<Record<string, string[]>>(
      (acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? value : [value];

        return acc;
      },
      {},
    ),
  )
  public filters?: Record<string, string[]>;

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
