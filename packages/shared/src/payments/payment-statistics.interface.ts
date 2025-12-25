import { DueCategory } from '../dues';

export interface IPaymentStatisticsByCategoryItemDto {
  amount: number;
  average: number;
  count: number;
}

export interface IPaymentStatisticsDto {
  average: number;
  categories: Record<DueCategory, IPaymentStatisticsByCategoryItemDto>;
  count: number;
  total: number;
}

export interface IPaymentStatisticsQueryDto {
  dateRange?: [string, string];
}
