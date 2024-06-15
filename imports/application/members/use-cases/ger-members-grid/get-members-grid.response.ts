import { FindPaginatedResponse } from '@application/common/repositories/grid.repository';
import { MemberGridDto } from '@application/members/dtos/member-grid.dto';

export type GetMembersGridResponse = FindPaginatedResponse<MemberGridDto>;
