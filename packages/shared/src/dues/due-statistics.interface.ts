import type { DueCategory } from './due.enum';

export interface IDuePendingStatisticsDto {
  categories: Record<DueCategory, number>;
  total: number;
}
