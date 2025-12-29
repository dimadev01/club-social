import type {
  GetPaymentStatisticsDto,
  PaymentStatisticsCategoryDto,
  PaymentStatisticsDto,
} from '@club-social/shared/payments';

import { DueCategory } from '@club-social/shared/dues';
import { IsArray, IsDateString, IsOptional } from 'class-validator';

export class GetPaymentStatisticsRequestDto implements GetPaymentStatisticsDto {
  @IsArray()
  @IsDateString({}, { each: true })
  @IsOptional()
  public dateRange?: [string, string];
}

export class PaymentStatisticsCategoryResponseDto implements PaymentStatisticsCategoryDto {
  public amount: number;
  public average: number;
  public count: number;
}

export class PaymentStatisticsResponseDto implements PaymentStatisticsDto {
  public average: number;
  public categories: Record<DueCategory, PaymentStatisticsCategoryResponseDto>;
  public count: number;
  public paidDuesCount: number;
  public total: number;
}
