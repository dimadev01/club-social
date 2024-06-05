import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

import { GetGridRequestDto } from '@adapters/common/dtos/get-grid-request.dto';
import { FindPaginatedPaymentsRequest } from '@domain/payments/payment.repository';

export class GetPaymentsGridRequestDto
  extends GetGridRequestDto
  implements FindPaginatedPaymentsRequest
{
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  public filterByMember!: string[];
}
