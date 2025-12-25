import type {
  IPaymentStatisticsByCategoryItemDto,
  IPaymentStatisticsDto,
} from '@club-social/shared/payments';

import { DueCategory } from '@club-social/shared/dues';

export class PaymentStatisticsByCategoryItemDto implements IPaymentStatisticsByCategoryItemDto {
  public amount: number;
  public average: number;
  public count: number;
}

export class PaymentStatisticsDto implements IPaymentStatisticsDto {
  public average: number;
  public categories: Record<DueCategory, PaymentStatisticsByCategoryItemDto>;
  public count: number;
  public total: number;
}
