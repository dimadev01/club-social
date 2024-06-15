import { IsArray, IsEnum, IsString } from 'class-validator';

import { FindPaginatedPaymentsRequest } from '@application/payments/repositories/payment.repository';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { GetGridRequestDto } from '@ui/common/dtos/get-grid-request.dto';

export class GetPaymentsGridRequestDto
  extends GetGridRequestDto
  implements FindPaginatedPaymentsRequest
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
