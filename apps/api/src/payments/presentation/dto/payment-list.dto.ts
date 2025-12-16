import { PaginatedRequestSort } from '@club-social/shared/types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { PaginatedRequestSortDto } from '@/shared/presentation/dto/paginated-request-sort.dto';

export class PaymentListRequestDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  public dueId?: string;

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
  @IsOptional()
  @Type(() => PaginatedRequestSortDto)
  @ValidateNested({ each: true })
  public sort?: PaginatedRequestSort[];
}
