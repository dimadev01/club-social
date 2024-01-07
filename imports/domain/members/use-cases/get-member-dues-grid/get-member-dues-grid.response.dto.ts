import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';
import { MemberDueGridDto } from './member-due-grid.dto';

export class GetMemberDuesGridResponseDto extends PaginatedResponse<MemberDueGridDto> {
  totalDues: string;

  totalPayments: string;

  balance: string;
}
