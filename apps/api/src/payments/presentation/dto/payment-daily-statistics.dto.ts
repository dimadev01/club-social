import type {
  GetPaymentDailyStatisticsDto,
  PaymentDailyStatisticsDto,
  PaymentDailyStatisticsItemDto,
} from '@club-social/shared/payments';

import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class GetPaymentDailyStatisticsRequestDto implements GetPaymentDailyStatisticsDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, { message: 'month must be in YYYY-MM format' })
  public month: string;
}

export class PaymentDailyStatisticsItemResponseDto implements PaymentDailyStatisticsItemDto {
  public amount: number;
  public count: number;
  public date: string;
}

export class PaymentDailyStatisticsResponseDto implements PaymentDailyStatisticsDto {
  public days: PaymentDailyStatisticsItemResponseDto[];
}
