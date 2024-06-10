import { IsArray, IsEnum, IsString } from 'class-validator';

import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { FindPaginatedPaymentsFilters } from '@domain/payments/payment.repository';

export class GetPaymentsTotalsRequestDto
  implements FindPaginatedPaymentsFilters
{
  @IsString({ each: true })
  @IsArray()
  public filterByMember!: string[];

  @IsEnum(PaymentStatusEnum, { each: true })
  @IsArray()
  public filterByStatus!: PaymentStatusEnum[];
}
