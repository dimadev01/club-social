export interface IMovementBalanceDto {
  balance: number;
}

export interface IMovementStatisticsDto {
  balance: number;
  total: number;
  totalInflow: number;
  totalOutflow: number;
}

export interface IMovementStatisticsQueryDto {
  dateRange?: [string, string];
}
