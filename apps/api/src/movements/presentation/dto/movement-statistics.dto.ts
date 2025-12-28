import type {
  MovementBalanceDto,
  MovementStatisticsDto,
  MovementStatisticsQueryDto,
} from '@club-social/shared/movements';

import { IsArray, IsDateString, IsOptional } from 'class-validator';

export class MovementBalanceResponseDto implements MovementBalanceDto {
  public balance: number;
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
