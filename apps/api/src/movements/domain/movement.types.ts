export interface MovementBalanceModel {
  balance: number;
}

export interface MovementPaginatedExtraModel {
  totalAmount: number;
  totalAmountInflow: number;
  totalAmountOutflow: number;
}

export interface MovementStatisticsModel {
  balance: number;
  totalInflow: number;
  totalOutflow: number;
}
