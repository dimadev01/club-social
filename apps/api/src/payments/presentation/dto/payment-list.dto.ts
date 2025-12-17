import { IsOptional, IsString, IsUUID } from 'class-validator';

import { PaginatedRequestDto } from '@/shared/presentation/dto/paginated-request.dto';

export class PaymentListRequestDto extends PaginatedRequestDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  public dueId?: string;
}
