export interface MovementBalanceDto {
  balance: number;
}

export interface MovementStatisticsDto {
  balance: number;
  total: number;
  totalInflow: number;
  totalOutflow: number;
}

export interface MovementStatisticsQueryDto {
  dateRange?: [string, string];
}
