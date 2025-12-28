import type {
  DueCategory,
  DuePendingStatisticsDto,
} from '@club-social/shared/dues';

export class DuePendingStatisticsResponseDto implements DuePendingStatisticsDto {
  public categories: Record<DueCategory, number>;
  public total: number;
}
