import { MemberGridDto } from '@domain/members/use-cases/get-members/member-grid.dto';
import { PaginatedResponse } from '@kernel/paginated-response.dto';

export class GetMembersResponseDto extends PaginatedResponse<MemberGridDto> {}
