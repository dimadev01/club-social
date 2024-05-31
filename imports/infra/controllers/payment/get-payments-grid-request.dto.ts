import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

import { FindPaginatedPaymentsRequest } from '@domain/payments/repositories/find-paginated-payments.interface';
import { GetGridRequestDto } from '@infra/controllers/types/get-grid-request.dto';

export class GetPaymentsGridRequestDto
  extends GetGridRequestDto
  implements FindPaginatedPaymentsRequest
{
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  public filterByMember?: string[];
}
