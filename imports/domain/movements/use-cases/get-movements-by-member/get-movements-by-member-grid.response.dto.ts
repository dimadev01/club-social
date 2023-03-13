import { MovementByMemberGridDto } from '@domain/movements/use-cases/get-movements-by-member/get-movements-by-member-grid.dto';
import { PaginatedResponse } from '@kernel/paginated-response.dto';

export class GetMovementsByMemberGridResponseDto extends PaginatedResponse<MovementByMemberGridDto> {
  income: number;

  debt: number;

  balance: number;
}
