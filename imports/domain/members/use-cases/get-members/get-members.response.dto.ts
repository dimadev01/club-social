import { Member } from '@domain/members/member.entity';
import { PaginatedResponse } from '@kernel/paginated-response.dto';

export class GetMembersResponseDto extends PaginatedResponse<Member> {}
