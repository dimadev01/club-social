import { GetPaymentStatisticsDto } from '@club-social/shared/payments';
import { IsArray, IsDateString, IsOptional } from 'class-validator';

export class GetPaymentStatisticsRequestDto implements GetPaymentStatisticsDto {
  @IsArray()
  @IsDateString({}, { each: true })
  @IsOptional()
  public dateRange?: [string, string];
}
