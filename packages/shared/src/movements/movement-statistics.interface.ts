import { MovementCategory } from './movement.enum';

export interface MovementBalanceDto {
  balance: number;
}

export interface MovementByCategoryDto {
  categories: MovementCategoryBreakdownDto[];
  total: number;
}

export interface MovementCategoryBreakdownDto {
  amount: number;
  category: MovementCategory;
  count: number;
  percentage: number;
}

export interface MovementMonthlyTrendDto {
  months: MovementMonthlyTrendItemDto[];
}

export interface MovementMonthlyTrendItemDto {
  balance: number;
  month: string; // "YYYY-MM"
  totalInflow: number;
  totalOutflow: number;
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
