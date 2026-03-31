import type {
  MovementBalanceDto,
  MovementByCategoryDto,
  MovementCategory,
  MovementCategoryBreakdownDto,
  MovementMonthlyTrendDto,
  MovementMonthlyTrendItemDto,
  MovementStatisticsDto,
  MovementStatisticsQueryDto,
} from '@club-social/shared/movements';

import { MovementType } from '@club-social/shared/movements';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class GetByCategoryQueryRequestDto {
  @IsArray()
  @IsDateString({}, { each: true })
  @IsOptional()
  public dateRange?: [string, string];

  @IsIn(Object.values(MovementType))
  @IsOptional()
  public type?: MovementType;
}

export class GetMonthlyTrendQueryRequestDto {
  @IsInt()
  @IsOptional()
  @Max(24)
  @Min(1)
  @Type(() => Number)
  public months?: number;
}

export class MovementBalanceResponseDto implements MovementBalanceDto {
  public balance: number;
}

export class MovementCategoryBreakdownResponseDto implements MovementCategoryBreakdownDto {
  public amount: number;
  public category: MovementCategory;
  public count: number;
  public percentage: number;
}

export class MovementByCategoryResponseDto implements MovementByCategoryDto {
  public categories: MovementCategoryBreakdownResponseDto[];
  public total: number;
}

export class MovementMonthlyTrendItemResponseDto implements MovementMonthlyTrendItemDto {
  public balance: number;
  public month: string;
  public totalInflow: number;
  public totalOutflow: number;
}

export class MovementMonthlyTrendResponseDto implements MovementMonthlyTrendDto {
  public months: MovementMonthlyTrendItemResponseDto[];
}

export class MovementStatisticsQueryRequestDto implements MovementStatisticsQueryDto {
  @IsArray()
  @IsDateString({}, { each: true })
  @IsOptional()
  public dateRange?: [string, string];
}

export class MovementStatisticsResponseDto implements MovementStatisticsDto {
  public balance: number;
  public total: number;
  public totalInflow: number;
  public totalOutflow: number;
}
