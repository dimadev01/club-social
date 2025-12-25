import { IPaymentStatisticsQueryDto } from '@club-social/shared/payments';
import { IsArray, IsDateString, IsOptional } from 'class-validator';

export class PaymentStatisticsQueryDto implements IPaymentStatisticsQueryDto {
  @IsArray()
  @IsDateString({}, { each: true })
  @IsOptional()
  public dateRange?: [string, string];
}
