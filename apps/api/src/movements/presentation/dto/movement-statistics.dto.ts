import type {
  IMovementBalanceDto,
  IMovementStatisticsDto,
  IMovementStatisticsQueryDto,
} from '@club-social/shared/movements';

import { IsArray, IsDateString, IsOptional } from 'class-validator';

export class MovementBalanceDto implements IMovementBalanceDto {
  public balance: number;
}

export class MovementStatisticsDto implements IMovementStatisticsDto {
  public balance: number;
  public totalInflow: number;
  public totalOutflow: number;
}

export class MovementStatisticsQueryDto implements IMovementStatisticsQueryDto {
  @IsArray()
  @IsDateString({}, { each: true })
  @IsOptional()
  public dateRange?: [string, string];
}
