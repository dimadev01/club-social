import { PaginatedResponse } from '@application/common/paginated-response.dto';
import { MemberMovementGridDto } from '@domain/members/use-cases/get-member-movements/get-member-movements-grid.dto';

export class GetMemberMovementsGridResponseDto extends PaginatedResponse<MemberMovementGridDto> {
  income: number;

  debt: number;

  balance: number;
}
