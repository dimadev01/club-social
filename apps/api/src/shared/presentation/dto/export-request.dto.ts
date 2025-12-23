import { ExportRequest } from '@club-social/shared/types';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { PaginatedRequestSortDto } from './paginated-request-sort.dto';

export class ExportRequestDto implements ExportRequest {
  @IsNotEmpty()
  @IsString()
  public filename: string;

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

  @IsArray()
  @Type(() => PaginatedRequestSortDto)
  @ValidateNested({ each: true })
  public sort: PaginatedRequestSortDto[];
}
