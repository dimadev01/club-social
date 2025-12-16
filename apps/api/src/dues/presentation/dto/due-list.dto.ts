import { DueCategory, DueStatus } from '@club-social/shared/dues';
import { PaginatedRequestSort } from '@club-social/shared/types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { PaginatedRequestSortDto } from '@/shared/presentation/dto/paginated-request-sort.dto';

export class DueListRequestDto {
  @IsEnum(DueCategory)
  @IsOptional()
  public category?: DueCategory;

  @IsOptional()
  @IsString()
  @IsUUID()
  public memberId?: string;

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

  @IsEnum(DueStatus)
  @IsOptional()
  public status?: DueStatus;
}
