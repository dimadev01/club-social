import { MemberDueGridDto } from './member-due-grid.dto';

import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';

export class GetMemberDuesGridResponseDto extends PaginatedResponse<MemberDueGridDto> {
  totalDues: string;

  totalPayments: string;

  balance: string;
}
