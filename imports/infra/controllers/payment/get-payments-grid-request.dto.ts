import { ArrayMinSize, IsArray, IsDefined, IsString } from 'class-validator';

import { FindPaginatedPaymentsRequest } from '@domain/payments/repositories/find-paginated-payments.interface';
import { GetGridRequestDto } from '@infra/controllers/types/get-grid-request.dto';
import { IsNullable } from '@shared/class-validator/is-nullable';

export class GetPaymentsGridRequestDto
  extends GetGridRequestDto
  implements FindPaginatedPaymentsRequest
{
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNullable()
  @IsDefined()
  public filterByMember!: string[] | null;
}
