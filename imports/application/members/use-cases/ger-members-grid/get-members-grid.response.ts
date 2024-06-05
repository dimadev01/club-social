import { MemberGridDto } from '@application/members/dtos/member-grid.dto';
import { FindPaginatedMembersResponse } from '@domain/members/member.repository';

export type GetMembersGridResponse =
  FindPaginatedMembersResponse<MemberGridDto>;
