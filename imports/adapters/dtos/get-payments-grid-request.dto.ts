import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

import { GetGridRequestDto } from '@adapters/common/dtos/get-grid-request.dto';
import { GetPaymentsGridRequest } from '@application/payments/use-cases/get-payments-grid/get-payments-grid.request';

export class GetPaymentsGridRequestDto
  extends GetGridRequestDto
  implements GetPaymentsGridRequest
{
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  public filterByMember!: string[];
}
