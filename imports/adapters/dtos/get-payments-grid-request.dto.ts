import { IsArray, IsEnum, IsString } from 'class-validator';

import { GetGridRequestDto } from '@adapters/common/dtos/get-grid-request.dto';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { FindPaginatedPaymentsRequest } from '@domain/payments/payment.repository';

export class GetPaymentsGridRequestDto
  extends GetGridRequestDto
  implements FindPaginatedPaymentsRequest
{
  @IsString({ each: true })
  @IsArray()
  public filterByMember!: string[];

  @IsEnum(PaymentStatusEnum, { each: true })
  @IsArray()
  public filterByStatus!: string[];
}
