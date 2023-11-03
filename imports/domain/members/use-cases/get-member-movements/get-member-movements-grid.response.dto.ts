import { MemberMovementGridDto } from '@domain/members/use-cases/get-member-movements/get-member-movements-grid.dto';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';

export class GetMemberMovementsGridResponseDto extends PaginatedResponse<MemberMovementGridDto> {
  income: number;

  debt: number;

  balance: number;
}
