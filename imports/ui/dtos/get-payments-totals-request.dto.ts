import { IsArray, IsEnum, IsString } from 'class-validator';

import { FindPaginatedPaymentsFilters } from '@application/payments/repositories/payment.repository';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';

export class GetPaymentsTotalsRequestDto
  implements FindPaginatedPaymentsFilters
{
  @IsString({ each: true })
  @IsArray()
  public filterByCreatedAt!: string[];

  @IsString({ each: true })
  @IsArray()
  public filterByDate!: string[];

  @IsString({ each: true })
  @IsArray()
  public filterByMember!: string[];

  @IsEnum(PaymentStatusEnum, { each: true })
  @IsArray()
  public filterByStatus!: PaymentStatusEnum[];
}
