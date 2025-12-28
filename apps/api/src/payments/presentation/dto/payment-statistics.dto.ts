import type {
  IPaymentStatisticsByCategoryItemDto,
  PaymentStatistics,
} from '@club-social/shared/payments';

import { DueCategory } from '@club-social/shared/dues';

export class PaymentStatisticsByCategoryItemDto implements IPaymentStatisticsByCategoryItemDto {
  public amount: number;
  public average: number;
  public count: number;
}

export class PaymentStatisticsResponseDto implements PaymentStatistics {
  public average: number;
  public categories: Record<DueCategory, PaymentStatisticsByCategoryItemDto>;
  public count: number;
  public dueSettlementsCount: number;
  public total: number;
}
