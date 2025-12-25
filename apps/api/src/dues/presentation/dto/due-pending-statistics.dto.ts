import type {
  DueCategory,
  IDuePendingStatisticsDto,
} from '@club-social/shared/dues';

export class DuePendingStatisticsDto implements IDuePendingStatisticsDto {
  public categories: Record<DueCategory, number>;
  public total: number;
}
