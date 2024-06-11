import { IsArray, IsDefined, IsEnum, IsString } from 'class-validator';

import { IsNullable } from '@adapters/common/class-validator/is-nullable';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { FindPaginatedPaymentsFilters } from '@domain/payments/payment.repository';

export class GetPaymentsTotalsRequestDto
  implements FindPaginatedPaymentsFilters
{
  @IsString({ each: true })
  @IsArray()
  public filterByMember!: string[];

  @IsString()
  @IsNullable()
  @IsDefined()
  public filterByFrom!: string | null;

  @IsString()
  @IsNullable()
  @IsDefined()
  public filterByTo!: string | null;

  @IsEnum(PaymentStatusEnum, { each: true })
  @IsArray()
  public filterByStatus!: PaymentStatusEnum[];
}
