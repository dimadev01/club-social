import type {
  GetPaymentDailyStatisticsDto,
  PaymentDailyStatisticsDto,
  PaymentDailyStatisticsItemDto,
} from '@club-social/shared/payments';

import { IsDateString, IsNotEmpty } from 'class-validator';

export class GetPaymentDailyStatisticsRequestDto implements GetPaymentDailyStatisticsDto {
  @IsDateString()
  @IsNotEmpty()
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
