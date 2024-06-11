import { IsArray, IsDefined, IsEnum, IsString } from 'class-validator';

import { IsNullable } from '@adapters/common/class-validator/is-nullable';
import { GetGridRequestDto } from '@adapters/common/dtos/get-grid-request.dto';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { FindPaginatedPaymentsRequest } from '@domain/payments/payment.repository';

export class GetPaymentsGridRequestDto
  extends GetGridRequestDto
  implements FindPaginatedPaymentsRequest
{
  @IsString()
  @IsNullable()
  @IsDefined()
  public filterByFrom!: string | null;

  @IsString({ each: true })
  @IsArray()
  public filterByMember!: string[];

  @IsEnum(PaymentStatusEnum, { each: true })
  @IsArray()
  public filterByStatus!: string[];

  @IsString()
  @IsNullable()
  @IsDefined()
  public filterByTo!: string | null;
}
