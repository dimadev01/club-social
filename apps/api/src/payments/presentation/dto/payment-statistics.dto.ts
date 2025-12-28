import type {
  PaymentStatisticsCategoryDto,
  PaymentStatisticsDto,
} from '@club-social/shared/payments';

import { DueCategory } from '@club-social/shared/dues';

export class PaymentStatisticsCategoryResponseDto implements PaymentStatisticsCategoryDto {
  public amount: number;
  public average: number;
  public count: number;
}

export class PaymentStatisticsResponseDto implements PaymentStatisticsDto {
  public average: number;
  public categories: Record<DueCategory, PaymentStatisticsCategoryResponseDto>;
  public count: number;
  public dueSettlementsCount: number;
  public total: number;
}
